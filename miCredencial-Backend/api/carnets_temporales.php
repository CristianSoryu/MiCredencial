<?php
require_once '../config/db.php';
initApiHeaders("GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $id_usuario = trim($_GET['id_usuario'] ?? '');
    if (!$id_usuario) {
        echo json_encode(["success" => false, "message" => "id_usuario requerido"]);
        exit;
    }

    $rolesInfo = obtenerRolesUsuario($conn, $id_usuario);
    if (!in_array('generar carnet temporal', $rolesInfo['expanded'])) {
        echo json_encode(["success" => true, "carnets" => [], "permitido" => false]);
        $conn->close();
        exit;
    }

    $stmt = $conn->prepare("
        SELECT ct.id_temporal, ct.tipo, ct.nombre, ct.documento, ct.motivo, ct.codigo_qr,
               DATE_FORMAT(ct.fecha_expiracion, '%h:%i %p') AS hora_expiracion,
               DATE_FORMAT(ct.fecha_expiracion, '%Y-%m-%d %h:%i %p') AS fecha_expiracion,
               CONCAT(u.nombres, ' ', u.apellidos) AS anfitrion
        FROM carnets_temporales ct
        JOIN usuarios u ON ct.id_creador = u.id_usuario
        WHERE ct.fecha_expiracion >= NOW()
        ORDER BY ct.id_temporal DESC
        LIMIT 20
    ");
    $stmt->execute();
    $res = $stmt->get_result();

    $carnets = [];
    while ($row = $res->fetch_assoc()) {
        $row['codigo_qr_base64'] = base64_encode($row['codigo_qr']);
        $carnets[] = $row;
    }
    $stmt->close();

    echo json_encode(["success" => true, "permitido" => true, "carnets" => $carnets]);
    $conn->close();
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);

    $id_creador = trim($input['id_creador'] ?? '');
    $tipo = trim($input['tipo'] ?? 'persona');
    $nombre = trim($input['nombre'] ?? '');
    $documento = trim($input['documento'] ?? '');
    $motivo = trim($input['motivo'] ?? '');
    $duracion = intval($input['duracion'] ?? 60);

    if (!$id_creador) {
        echo json_encode(["success" => false, "message" => "No autorizado"]);
        exit;
    }

    $rolesInfo = obtenerRolesUsuario($conn, $id_creador);
    if (!in_array('generar carnet temporal', $rolesInfo['expanded'])) {
        echo json_encode(["success" => false, "message" => "No tiene permisos para generar carnets temporales."]);
        exit;
    }

    if (!in_array($tipo, ['persona', 'grupo']) || !$nombre || !$motivo) {
        echo json_encode(["success" => false, "message" => "Complete todos los campos obligatorios."]);
        exit;
    }

    if ($tipo === 'persona' && !$documento) {
        echo json_encode(["success" => false, "message" => "El número de documento es obligatorio para personas individuales."]);
        exit;
    }

    if ($duracion < 30 || $duracion > 720) {
        echo json_encode(["success" => false, "message" => "La duración debe estar entre 30 minutos y 12 horas."]);
        exit;
    }

    $hostStmt = $conn->prepare("SELECT nombres, apellidos FROM usuarios WHERE id_usuario = ? LIMIT 1");
    $hostStmt->bind_param("s", $id_creador);
    $hostStmt->execute();
    $host = $hostStmt->get_result()->fetch_assoc();
    $hostStmt->close();
    $anfitrion = $host ? trim($host['nombres'] . ' ' . $host['apellidos']) : 'Personal Autorizado';

    $codigo_qr = 'TEMP_' . bin2hex(random_bytes(16));
    $fecha_creacion = date('Y-m-d H:i:s');
    $fecha_expiracion = date('Y-m-d H:i:s', strtotime('+' . $duracion . ' minutes'));
    $doc_val = ($tipo === 'persona') ? $documento : null;

    $stmt = $conn->prepare("
        INSERT INTO carnets_temporales (id_creador, tipo, nombre, documento, motivo, fecha_creacion, fecha_expiracion, codigo_qr)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->bind_param("ssssssss", $id_creador, $tipo, $nombre, $doc_val, $motivo, $fecha_creacion, $fecha_expiracion, $codigo_qr);

    if ($stmt->execute()) {
        crearNotificacion(
            $conn,
            $id_creador,
            "Carnet Temporal Generado",
            "Se creó el pase temporal para $nombre (expira " . date('h:i A', strtotime($fecha_expiracion)) . ").",
            "exito"
        );
        echo json_encode([
            "success" => true,
            "message" => "Carnet temporal creado con éxito.",
            "carnet" => [
                "tipo" => $tipo,
                "nombre" => $nombre,
                "documento" => $tipo === 'persona' ? $documento : 'GRUPO / INSTITUCIÓN',
                "motivo" => $motivo,
                "fecha_expiracion" => date('Y-m-d h:i A', strtotime($fecha_expiracion)),
                "codigo_qr_base64" => base64_encode($codigo_qr),
                "anfitrion" => $anfitrion
            ]
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al crear carnet temporal."]);
    }
    $stmt->close();
    $conn->close();
}
?>
