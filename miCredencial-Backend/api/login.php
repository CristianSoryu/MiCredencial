<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);
$documento = trim($data['documento'] ?? '');
$contrasena = trim($data['contrasena'] ?? '');

if (!$documento || !$contrasena) {
    echo json_encode(["success" => false, "message" => "Campos requeridos"]);
    exit;
}

$stmt = $conn->prepare("
    SELECT u.id_usuario, u.nombres, u.apellidos, u.email, u.estado, u.foto,
           r.tipo_usuario
    FROM usuarios u
    LEFT JOIN usuario_rol ur ON u.id_usuario = ur.id_usuario
    LEFT JOIN roles r ON ur.id_rol = r.id_rol
    WHERE u.id_usuario = ? AND u.contrasena = ? AND u.estado = 'activo'
    LIMIT 1
");

$stmt->bind_param("ss", $documento, $contrasena);
$stmt->execute();
$row = $stmt->get_result()->fetch_assoc();

if ($row) {
    echo json_encode(["success" => true, "usuario" => $row]);
} else {
    echo json_encode(["success" => false, "message" => "Credenciales incorrectas"]);
}

$stmt->close();
$conn->close();