<?php
require_once '../config/db.php';
initApiHeaders("POST, OPTIONS");

$input = json_decode(file_get_contents("php://input"), true);
$id_usuario = trim($input['id_usuario'] ?? '');
$actual = trim($input['contrasena_actual'] ?? '');
$nueva = trim($input['contrasena_nueva'] ?? '');

if (!$id_usuario || !$actual || !$nueva) {
    echo json_encode(["success" => false, "message" => "Complete todos los campos."]);
    exit;
}

if (strlen($nueva) < 4) {
    echo json_encode(["success" => false, "message" => "La nueva contraseña debe tener al menos 4 caracteres."]);
    exit;
}

$stmt = $conn->prepare("SELECT contrasena FROM usuarios WHERE id_usuario = ? LIMIT 1");
$stmt->bind_param("s", $id_usuario);
$stmt->execute();
$row = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$row || ($actual !== $row['contrasena'] && !empty($row['contrasena']))) {
    echo json_encode(["success" => false, "message" => "La contraseña actual es incorrecta."]);
    exit;
}

$up = $conn->prepare("UPDATE usuarios SET contrasena = ? WHERE id_usuario = ?");
$up->bind_param("ss", $nueva, $id_usuario);
if ($up->execute()) {
    crearNotificacion($conn, $id_usuario, "Contraseña actualizada", "Tu contraseña ha sido cambiada correctamente.", "info");
    echo json_encode(["success" => true, "message" => "Contraseña actualizada correctamente."]);
} else {
    echo json_encode(["success" => false, "message" => "No se pudo actualizar la contraseña."]);
}
$up->close();
$conn->close();
?>
