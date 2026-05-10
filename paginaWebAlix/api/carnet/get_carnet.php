<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['success' => false, 'message' => 'No autorizado', 'redirect' => 'index.html']);
    exit();
}

require_once '../conexion.php';

$id_usuario_logueado = $_SESSION['usuario_id']; 

try {
    $sql = "SELECT u.nombres, u.apellidos, u.tipo_documento, u.id_usuario, u.foto, r.tipo_usuario 
            FROM usuarios u 
            LEFT JOIN usuario_rol ur ON u.id_usuario = ur.id_usuario 
            LEFT JOIN roles r ON ur.id_rol = r.id_rol 
            WHERE u.id_usuario = :id";
    $consulta = $conexion->prepare($sql);
    $consulta->bindParam(':id', $id_usuario_logueado);
    $consulta->execute();
    $usuario = $consulta->fetch(PDO::FETCH_ASSOC);

    if (!$usuario) {
        session_destroy();
        echo json_encode(['success' => false, 'message' => 'Usuario no encontrado', 'redirect' => 'index.html']);
        exit();
    }
    
    $rol_usuario = $usuario['tipo_usuario'] ?? 'estudiante';
    
    // Devolver los datos del usuario para pintar el carnet
    echo json_encode([
        'success' => true,
        'usuario' => [
            'nombre_completo' => strtoupper($usuario['nombres'] . ' ' . $usuario['apellidos']),
            'identificacion' => $usuario['tipo_documento'] . ' ' . $usuario['id_usuario'],
            'documento_puro' => $usuario['id_usuario'],
            'foto' => $usuario['foto'],
            'rol' => $rol_usuario
        ]
    ]);
    
} catch(PDOException $error) {
    echo json_encode(['success' => false, 'message' => 'Error al cargar el carnet: ' . $error->getMessage()]);
}

