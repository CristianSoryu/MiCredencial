<?php
session_start();
header('Content-Type: application/json');

// Verificar sesión de admin
if (!isset($_SESSION['is_admin']) || $_SESSION['is_admin'] !== true) {
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit();
}

require_once '../conexion.php';

// Permitir recibir datos como JSON o como form-data
$input = json_decode(file_get_contents('php://input'), true);
if ($input) {
    $id_usuario = $input['id_usuario'] ?? '';
} else {
    $id_usuario = $_POST['id_usuario'] ?? '';
}

if (empty($id_usuario)) {
    echo json_encode(['success' => false, 'message' => 'ID de usuario requerido']);
    exit();
}

try {
    // Check current state
    $sql_check = "SELECT estado FROM usuarios WHERE id_usuario = :id_usuario";
    $stmt_check = $conexion->prepare($sql_check);
    $stmt_check->bindParam(':id_usuario', $id_usuario);
    $stmt_check->execute();
    
    $user = $stmt_check->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'Usuario no encontrado']);
        exit();
    }
    
    $nuevo_estado = ($user['estado'] === 'activo') ? 'inactivo' : 'activo';
    
    // Update state
    $sql_update = "UPDATE usuarios SET estado = :nuevo_estado WHERE id_usuario = :id_usuario";
    $stmt_update = $conexion->prepare($sql_update);
    $stmt_update->bindParam(':nuevo_estado', $nuevo_estado);
    $stmt_update->bindParam(':id_usuario', $id_usuario);
    
    if ($stmt_update->execute()) {
        echo json_encode([
            'success' => true, 
            'message' => 'Estado actualizado correctamente',
            'nuevo_estado' => $nuevo_estado
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al actualizar el estado']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error de base de datos: ' . $e->getMessage()]);
}
?>
