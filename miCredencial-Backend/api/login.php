<?php
require_once '../config/db.php';
initApiHeaders("POST, OPTIONS");

$data = json_decode(file_get_contents("php://input"), true);
$documento = trim($data['documento'] ?? '');
$contrasena = trim($data['contrasena'] ?? '');

if (!$documento || !$contrasena) {
    echo json_encode(["success" => false, "message" => "Por favor ingrese identificación y contraseña."]);
    exit;
}

$stmt = $conn->prepare("
    SELECT u.id_usuario, u.tipo_documento, u.nombres, u.apellidos, u.email, u.estado, u.foto, u.contrasena
    FROM usuarios u
    WHERE u.id_usuario = ?
    LIMIT 1
");
$stmt->bind_param("s", $documento);
$stmt->execute();
$row = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$row || ($contrasena !== $row['contrasena'] && !empty($row['contrasena']))) {
    echo json_encode(["success" => false, "message" => "Identificación o contraseña incorrectas."]);
    $conn->close();
    exit;
}

if ($row['estado'] !== 'activo') {
    echo json_encode(["success" => false, "message" => "Su carnet está inactivo. Contacte al administrador."]);
    $conn->close();
    exit;
}

$rolesInfo = obtenerRolesUsuario($conn, $row['id_usuario']);
$rawRoles = $rolesInfo['raw'];
$expandedRoles = $rolesInfo['expanded'];
$rolPrincipal = obtenerRolPrincipal($rawRoles);

// Validar preregistro o solicitud aprobada para usuarios no staff
$staffRoles = [
    'administrador', 'seguridad', 'admisiones_registro', 'biblioteca', 'bienestar',
    'escaneador', 'escaneador de biblioteca', 'escaneador de bienestar', 'administrativo', 'docente'
];
$esStaff = count(array_intersect($expandedRoles, $staffRoles)) > 0;

if (!$esStaff) {
    $preStmt = $conn->prepare("SELECT 1 FROM preregistro_oficial WHERE documento = ? LIMIT 1");
    $preStmt->bind_param("s", $row['id_usuario']);
    $preStmt->execute();
    $estaPre = $preStmt->get_result()->fetch_assoc();
    $preStmt->close();

    if (!$estaPre) {
        $egStmt = $conn->prepare("SELECT estado FROM solicitudes_egresados_no_graduados WHERE identificacion = ? ORDER BY id DESC LIMIT 1");
        $egStmt->bind_param("s", $row['id_usuario']);
        $egStmt->execute();
        $sol = $egStmt->get_result()->fetch_assoc();
        $egStmt->close();

        if ($sol) {
            if ($sol['estado'] !== 'aprobado') {
                echo json_encode([
                    "success" => false,
                    "message" => "Su solicitud de egresado no graduado se encuentra " . $sol['estado'] . "."
                ]);
                $conn->close();
                exit;
            }
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Su acceso está deshabilitado. No se encuentra en el preregistro oficial."
            ]);
            $conn->close();
            exit;
        }
    }
}

// Obtener programa académico o cargo
$progStmt = $conn->prepare("
    SELECT programa_academico FROM preregistro_oficial WHERE documento = ?
    UNION
    SELECT programa_academico FROM solicitudes_egresados_no_graduados WHERE identificacion = ? AND estado = 'aprobado'
    LIMIT 1
");
$progStmt->bind_param("ss", $row['id_usuario'], $row['id_usuario']);
$progStmt->execute();
$progRow = $progStmt->get_result()->fetch_assoc();
$progStmt->close();

$programa = $progRow['programa_academico'] ?? match ($rolPrincipal) {
    'administrador' => 'Administrador TIC',
    'seguridad' => 'Seguridad y Control de Acceso',
    'bienestar' => 'Bienestar Universitario',
    'biblioteca' => 'Biblioteca Seccional Cúcuta',
    'docente' => 'Docente Universitario',
    'administrativo' => 'Personal Administrativo',
    default => 'Ingeniería en Tecnologías de la Información y Comunicación',
};

unset($row['contrasena']);
$row['tipo_usuario'] = $rolPrincipal;
$row['roles'] = $expandedRoles;
$row['roles_base'] = $rawRoles;
$row['programa'] = $programa;

echo json_encode([
    "success" => true,
    "usuario" => $row
]);

$conn->close();
?>
