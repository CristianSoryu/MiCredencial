<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['is_admin']) || $_SESSION['is_admin'] !== true) {
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit();
}

require_once '../conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input = json_decode(file_get_contents('php://input'), true);
    $id_usuario = $input['id_usuario'] ?? '';
    $id_rol = $input['id_rol'] ?? '';

    if (empty($id_usuario) || empty($id_rol)) {
        echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
        exit();
    }

    try {
        $conexion->beginTransaction();

        // Eliminar roles anteriores (asumiendo 1 rol por usuario para simplificar)
        $delete_sql = "DELETE FROM usuario_rol WHERE id_usuario = :id_usuario";
        $delete_stmt = $conexion->prepare($delete_sql);
        $delete_stmt->bindParam(':id_usuario', $id_usuario);
        $delete_stmt->execute();

        // Insertar nuevo rol
        $insert_sql = "INSERT INTO usuario_rol (id_usuario, id_rol) VALUES (:id_usuario, :id_rol)";
        $insert_stmt = $conexion->prepare($insert_sql);
        $insert_stmt->bindParam(':id_usuario', $id_usuario);
        $insert_stmt->bindParam(':id_rol', $id_rol);
        $insert_stmt->execute();

        $conexion->commit();
        echo json_encode(['success' => true, 'message' => 'Rol actualizado correctamente']);
    } catch (PDOException $e) {
        $conexion->rollBack();
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
