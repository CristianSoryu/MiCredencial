<?php
require_once '../config/db.php';
initApiHeaders("POST, OPTIONS");

$input = json_decode(file_get_contents("php://input"), true);

$id_usuario = trim($input['id_usuario'] ?? '');
$tipo_documento = trim($input['tipo_documento'] ?? '');
$nombres = trim($input['nombres'] ?? '');
$apellidos = trim($input['apellidos'] ?? '');
$email = trim($input['email'] ?? '');
$contrasena = trim($input['contrasena'] ?? '');
$programa_academico = trim($input['programa_academico'] ?? '');

if (!$id_usuario || !$tipo_documento || !$nombres || !$apellidos || !$email || !$contrasena || !$programa_academico) {
    echo json_encode(["success" => false, "message" => "Por favor complete todos los campos obligatorios."]);
    exit;
}

if (!preg_match('/^[0-9]{4,15}$/', $id_usuario)) {
    echo json_encode(["success" => false, "message" => "El número de identificación debe contener solo números (4 a 15 dígitos)."]);
    exit;
}

if (!str_ends_with(strtolower($email), '@unilibre.edu.co')) {
    echo json_encode(["success" => false, "message" => "El correo debe ser institucional (@unilibre.edu.co)."]);
    exit;
}

if (strlen($contrasena) < 4) {
    echo json_encode(["success" => false, "message" => "La contraseña debe tener al menos 4 caracteres."]);
    exit;
}

// Verificar solicitud de egresado si aplica
$egStmt = $conn->prepare("SELECT estado FROM solicitudes_egresados_no_graduados WHERE identificacion = ? ORDER BY id DESC LIMIT 1");
$egStmt->bind_param("s", $id_usuario);
$egStmt->execute();
$sol = $egStmt->get_result()->fetch_assoc();
$egStmt->close();

$preStmt = $conn->prepare("SELECT id FROM preregistro_oficial WHERE documento = ? LIMIT 1");
$preStmt->bind_param("s", $id_usuario);
$preStmt->execute();
$estaPre = $preStmt->get_result()->fetch_assoc();
$preStmt->close();

if (!$estaPre && $sol && $sol['estado'] !== 'aprobado') {
    echo json_encode([
        "success" => false,
        "message" => "Su solicitud de egresado no graduado se encuentra " . $sol['estado'] . ". Solo se permite el registro a egresados aprobados."
    ]);
    exit;
}

// Verificar duplicados en usuarios
$dupStmt = $conn->prepare("SELECT id_usuario FROM usuarios WHERE id_usuario = ? OR email = ? LIMIT 1");
$dupStmt->bind_param("ss", $id_usuario, $email);
$dupStmt->execute();
if ($dupStmt->get_result()->fetch_assoc()) {
    $dupStmt->close();
    echo json_encode(["success" => false, "message" => "El documento o el correo ya se encuentran registrados."]);
    exit;
}
$dupStmt->close();

$conn->begin_transaction();
try {
    // Auto-preregistrar o actualizar preregistro_oficial
    if ($estaPre) {
        $upPre = $conn->prepare("UPDATE preregistro_oficial SET programa_academico = ?, correo = ? WHERE documento = ?");
        $upPre->bind_param("sss", $programa_academico, $email, $id_usuario);
        $upPre->execute();
        $upPre->close();
    } else {
        $inPre = $conn->prepare("
            INSERT INTO preregistro_oficial (tipo_documento, documento, nombres, apellidos, correo, programa_academico)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $inPre->bind_param("ssssss", $tipo_documento, $id_usuario, $nombres, $apellidos, $email, $programa_academico);
        $inPre->execute();
        $inPre->close();
    }

    $insUser = $conn->prepare("
        INSERT INTO usuarios (id_usuario, tipo_documento, nombres, apellidos, email, contrasena, estado)
        VALUES (?, ?, ?, ?, ?, ?, 'activo')
    ");
    $insUser->bind_param("ssssss", $id_usuario, $tipo_documento, $nombres, $apellidos, $email, $contrasena);
    $insUser->execute();
    $insUser->close();

    // Asignar rol estudiante (id_rol = 1)
    $insRol = $conn->prepare("INSERT IGNORE INTO usuario_rol (id_usuario, id_rol) VALUES (?, 1)");
    $insRol->bind_param("s", $id_usuario);
    $insRol->execute();
    $insRol->close();

    crearNotificacion(
        $conn,
        $id_usuario,
        "Bienvenido a Mi Credencial",
        "Tu cuenta de carnet digital ha sido creada exitosamente para el programa $programa_academico.",
        "exito"
    );

    $conn->commit();
    echo json_encode(["success" => true, "message" => "Usuario registrado exitosamente. Ya puedes iniciar sesión."]);
} catch (Throwable $e) {
    $conn->rollback();
    echo json_encode(["success" => false, "message" => "Error al registrar usuario: " . $e->getMessage()]);
}

$conn->close();
?>
