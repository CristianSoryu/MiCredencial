<?php
require_once '../config/db.php';
initApiHeaders("POST, OPTIONS");

$input = json_decode(file_get_contents("php://input"), true);

$nombres = trim($input['nombres'] ?? '');
$identificacion = trim($input['identificacion'] ?? '');
$correo = trim($input['correo'] ?? '');
$programa_academico = trim($input['programa_academico'] ?? '');

if (!$nombres || !$identificacion || !$correo || !$programa_academico) {
    echo json_encode(["success" => false, "message" => "Por favor complete todos los campos obligatorios."]);
    exit;
}

if (!preg_match('/^[0-9]{4,15}$/', $identificacion)) {
    echo json_encode(["success" => false, "message" => "El número de identificación debe ser numérico."]);
    exit;
}

if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["success" => false, "message" => "Ingrese un correo electrónico válido."]);
    exit;
}

$check = $conn->prepare("SELECT id FROM solicitudes_egresados_no_graduados WHERE identificacion = ? AND estado = 'pendiente' LIMIT 1");
$check->bind_param("s", $identificacion);
$check->execute();
if ($check->get_result()->fetch_assoc()) {
    $check->close();
    echo json_encode(["success" => false, "message" => "Ya existe una solicitud pendiente en revisión para este documento."]);
    exit;
}
$check->close();

$ins = $conn->prepare("
    INSERT INTO solicitudes_egresados_no_graduados (nombres, identificacion, correo, programa_academico, estado)
    VALUES (?, ?, ?, ?, 'pendiente')
");
$ins->bind_param("ssss", $nombres, $identificacion, $correo, $programa_academico);

if ($ins->execute()) {
    echo json_encode(["success" => true, "message" => "Solicitud enviada exitosamente. Un administrador la revisará pronto."]);
} else {
    echo json_encode(["success" => false, "message" => "Error al guardar la solicitud."]);
}

$ins->close();
$conn->close();
?>
