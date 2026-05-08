<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit();
}

require_once '../conexion.php';

$id_usuario_logueado = $_SESSION['usuario_id'];

// Leer los datos JSON que se envían
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['foto']) || empty($input['foto'])) {
    echo json_encode(['success' => false, 'message' => 'No se recibió ninguna imagen válida.']);
    exit();
}

$fotoBase64 = $input['foto'];

try {
    $sql = "UPDATE usuarios SET foto = :foto WHERE id_usuario = :id";
    $consulta = $conexion->prepare($sql);
    $consulta->bindParam(':foto', $fotoBase64, PDO::PARAM_STR); // Usamos PDO::PARAM_STR porque es base64
    $consulta->bindParam(':id', $id_usuario_logueado);
    $consulta->execute();

    if ($consulta->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Foto actualizada correctamente.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'No se realizaron cambios.']);
    }

} catch(PDOException $error) {
    echo json_encode(['success' => false, 'message' => 'Error al guardar la foto: ' . $error->getMessage()]);
}
