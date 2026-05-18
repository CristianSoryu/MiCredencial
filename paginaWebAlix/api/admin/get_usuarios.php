<?php
session_start();
header('Content-Type: application/json');

// Verificar sesión de admin
if (!isset($_SESSION['is_admin']) || $_SESSION['is_admin'] !== true) {
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit();
}

require_once '../conexion.php';

try {
    $sql = "SELECT u.id_usuario, u.nombres, u.apellidos, u.email, u.estado, r.tipo_usuario as rol, r.id_rol
            FROM usuarios u
            LEFT JOIN usuario_rol ur ON u.id_usuario = ur.id_usuario
            LEFT JOIN roles r ON ur.id_rol = r.id_rol
            ORDER BY u.apellidos, u.nombres";
    
    $stmt = $conexion->prepare($sql);
    $stmt->execute();
    $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'usuarios' => $usuarios]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
