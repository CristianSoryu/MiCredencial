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
    $sql = "SELECT nombres, apellidos, tipo_documento, id_usuario, foto FROM usuarios WHERE id_usuario = :id";
    $consulta = $conexion->prepare($sql);
    $consulta->bindParam(':id', $id_usuario_logueado);
    $consulta->execute();
    $usuario = $consulta->fetch(PDO::FETCH_ASSOC);

    if (!$usuario) {
        session_destroy();
        echo json_encode(['success' => false, 'message' => 'Usuario no encontrado', 'redirect' => 'index.html']);
        exit();
    }
    
    // Devolver los datos del usuario para pintar el carnet
    echo json_encode([
        'success' => true,
        'usuario' => [
            'nombre_completo' => strtoupper($usuario['nombres'] . ' ' . $usuario['apellidos']),
            'identificacion' => $usuario['tipo_documento'] . ' ' . $usuario['id_usuario'],
            'documento_puro' => $usuario['id_usuario'],
            'foto' => $usuario['foto']
        ]
    ]);
    
} catch(PDOException $error) {
    echo json_encode(['success' => false, 'message' => 'Error al cargar el carnet: ' . $error->getMessage()]);
}

