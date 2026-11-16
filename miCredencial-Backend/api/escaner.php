<?php
require_once '../config/db.php';
initApiHeaders("POST, OPTIONS");

$input = json_decode(file_get_contents("php://input"), true);
$accion = trim($input['accion'] ?? 'validar');
$id_operador = trim($input['id_operador'] ?? '');

if (!$id_operador) {
    echo json_encode(["success" => false, "message" => "Operador no autenticado."]);
    exit;
}

$rolesInfo = obtenerRolesUsuario($conn, $id_operador);
$expanded = $rolesInfo['expanded'];
$rolesPermitidos = ['escaneador', 'escaneador de bienestar', 'escaneador de biblioteca', 'bienestar', 'biblioteca', 'seguridad', 'administrador'];

if (count(array_intersect($expanded, $rolesPermitidos)) === 0) {
    echo json_encode(["success" => false, "message" => "No tiene permisos para usar el escáner."]);
    $conn->close();
    exit;
}

if ($accion === 'registrar') {
    $id_usuario = trim($input['id_usuario'] ?? '');
    $tipo = trim($input['tipo'] ?? '');
    $metodo = trim($input['metodo'] ?? '');

    if (!$id_usuario || !in_array($tipo, ['entrada', 'salida']) || !in_array($metodo, ['peatonal', 'vehicular'])) {
        echo json_encode(["success" => false, "message" => "Datos inválidos para registrar acceso."]);
        exit;
    }

    if (str_starts_with($id_usuario, 'TEMP_')) {
        $id_temporal = intval(str_replace('TEMP_', '', $id_usuario));
        $tStmt = $conn->prepare("SELECT tipo FROM carnets_temporales WHERE id_temporal = ? LIMIT 1");
        $tStmt->bind_param("i", $id_temporal);
        $tStmt->execute();
        $tRow = $tStmt->get_result()->fetch_assoc();
        $tStmt->close();

        $tipo_visitante = ($tRow && $tRow['tipo'] === 'grupo') ? 'institucion' : 'persona';
        $ins = $conn->prepare("
            INSERT INTO registro_visitantes_temporales (id_temporal, id_registrador, tipo, metodo, tipo_visitante)
            VALUES (?, ?, ?, ?, ?)
        ");
        $ins->bind_param("issss", $id_temporal, $id_operador, $tipo, $metodo, $tipo_visitante);
    } else {
        $ins = $conn->prepare("
            INSERT INTO registro (id_usuario, id_registrador, tipo, metodo)
            VALUES (?, ?, ?, ?)
        ");
        $ins->bind_param("ssss", $id_usuario, $id_operador, $tipo, $metodo);
    }

    if ($ins->execute()) {
        echo json_encode(["success" => true, "message" => "Acceso ($tipo - $metodo) registrado correctamente."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al guardar el registro de acceso."]);
    }
    $ins->close();
    $conn->close();
    exit;
}

// Acción: validar QR
$qr_data = trim($input['qr_data'] ?? '');
if (!$qr_data) {
    echo json_encode(["success" => false, "message" => "Datos QR vacíos."]);
    exit;
}

// Permite decodificar Base64 o aceptar formato directo si se digita manualmente (ej. documento)
$decoded = base64_decode($qr_data, true);
if ($decoded === false || !str_contains($decoded, '_')) {
    // Fallback por si digitan directamente la cédula o un código TEMP_
    if (str_starts_with($qr_data, 'TEMP_')) {
        $decoded = $qr_data;
    } elseif (preg_match('/^[0-9]{4,15}$/', $qr_data)) {
        $decoded = $qr_data . '_' . gmdate('Y-m-d\TH:i');
    } else {
        echo json_encode(["success" => false, "message" => "Formato de QR inválido."]);
        exit;
    }
}

$parts = explode('_', $decoded);
if ($parts[0] === 'TEMP') {
    $stmt = $conn->prepare("
        SELECT ct.*, u.nombres AS host_nombres, u.apellidos AS host_apellidos
        FROM carnets_temporales ct
        JOIN usuarios u ON ct.id_creador = u.id_usuario
        WHERE ct.codigo_qr = ?
        LIMIT 1
    ");
    $stmt->bind_param("s", $decoded);
    $stmt->execute();
    $temp = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$temp) {
        echo json_encode(["success" => false, "message" => "Carnet temporal no encontrado."]);
        $conn->close();
        exit;
    }

    $expiracion = strtotime($temp['fecha_expiracion']);
    if (time() > $expiracion) {
        echo json_encode(["success" => false, "message" => "El carnet temporal expiró el " . date('d/m/Y h:i A', $expiracion)]);
        $conn->close();
        exit;
    }

    echo json_encode([
        "success" => true,
        "usuario" => [
            "es_temporal" => true,
            "id_usuario" => "TEMP_" . $temp['id_temporal'],
            "nombre_completo" => strtoupper($temp['nombre']),
            "identificacion" => $temp['tipo'] === 'persona' ? ("CC " . $temp['documento']) : "GRUPO / INSTITUCIÓN",
            "rol" => "visitante temporal",
            "motivo" => $temp['motivo'],
            "anfitrion" => strtoupper($temp['host_nombres'] . ' ' . $temp['host_apellidos']),
            "fecha_expiracion" => date('Y-m-d h:i A', $expiracion),
            "foto" => null,
            "prestamos" => []
        ]
    ]);
    $conn->close();
    exit;
}

$id_usuario = $parts[0];
$qr_fecha_str = $parts[1] ?? '';
$qr_time = strtotime($qr_fecha_str . 'Z');
if (!$qr_time || abs(time() - $qr_time) > 120) {
    echo json_encode(["success" => false, "message" => "Código QR expirado (máximo 120s). Pida al usuario recargar su carnet."]);
    $conn->close();
    exit;
}

$uStmt = $conn->prepare("SELECT id_usuario, tipo_documento, nombres, apellidos, foto, estado FROM usuarios WHERE id_usuario = ? LIMIT 1");
$uStmt->bind_param("s", $id_usuario);
$uStmt->execute();
$user = $uStmt->get_result()->fetch_assoc();
$uStmt->close();

if (!$user) {
    echo json_encode(["success" => false, "message" => "Usuario no encontrado en el sistema."]);
    $conn->close();
    exit;
}

if ($user['estado'] !== 'activo') {
    echo json_encode(["success" => false, "message" => "Carnet INACTIVO / BLOQUEADO. Acceso denegado."]);
    $conn->close();
    exit;
}

$userRoles = obtenerRolesUsuario($conn, $id_usuario);
$rolDisplay = obtenerRolPrincipal($userRoles['raw']);

$progStmt = $conn->prepare("
    SELECT programa_academico FROM preregistro_oficial WHERE documento = ?
    UNION
    SELECT programa_academico FROM solicitudes_egresados_no_graduados WHERE identificacion = ? AND estado = 'aprobado'
    LIMIT 1
");
$progStmt->bind_param("ss", $id_usuario, $id_usuario);
$progStmt->execute();
$progRow = $progStmt->get_result()->fetch_assoc();
$progStmt->close();

// Consultar préstamos reales activos o vencidos en Bienestar y Biblioteca
$pStmt = $conn->prepare("
    SELECT area, elemento, estado, observaciones,
           DATE_FORMAT(fecha_vencimiento, '%Y-%m-%d %h:%i %p') AS fecha_vencimiento
    FROM prestamos
    WHERE id_usuario = ? AND estado IN ('activo', 'vencido')
    ORDER BY FIELD(estado, 'vencido', 'activo')
");
$pStmt->bind_param("s", $id_usuario);
$pStmt->execute();
$pRes = $pStmt->get_result();
$prestamos = [];
while ($pRow = $pRes->fetch_assoc()) {
    $prestamos[] = $pRow;
}
$pStmt->close();

echo json_encode([
    "success" => true,
    "usuario" => [
        "es_temporal" => false,
        "id_usuario" => $user['id_usuario'],
        "nombre_completo" => strtoupper($user['nombres'] . ' ' . $user['apellidos']),
        "identificacion" => $user['tipo_documento'] . ' ' . $user['id_usuario'],
        "rol" => $rolDisplay,
        "programa" => $progRow['programa_academico'] ?? 'Universidad Libre Seccional Cúcuta',
        "foto" => $user['foto'],
        "prestamos" => $prestamos
    ]
]);

$conn->close();
?>
