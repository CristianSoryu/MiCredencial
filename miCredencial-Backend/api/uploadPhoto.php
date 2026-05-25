<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);
$id   = intval($data['id_usuario'] ?? 0);
$foto = $data['foto'] ?? '';

if (!$id || !$foto) {
    echo json_encode(["success" => false, "message" => "Datos incompletos", "recibido" => $data]);
    exit;
}

$stmt = $conn->prepare("UPDATE usuarios SET foto = ? WHERE id_usuario = ?");
$stmt->bind_param("si", $foto, $id);
$stmt->execute();

echo json_encode([
    "success"       => $stmt->affected_rows > 0,
    "rows_affected" => $stmt->affected_rows,
    "id_usuario"    => $id
]);

$stmt->close();
$conn->close();
