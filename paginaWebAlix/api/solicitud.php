<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Datos inválidos']);
    exit;
}

$nombre = trim($data['nombre'] ?? '');
$documento = trim($data['documento'] ?? '');
$email = trim($data['email'] ?? '');
$programa = trim($data['programa'] ?? '');

if (empty($nombre) || empty($documento) || empty($email) || empty($programa)) {
    echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Correo electrónico inválido']);
    exit;
}

try {
    // Crear tabla si no existe
    $conexion->exec("CREATE TABLE IF NOT EXISTS solicitudes_carnet (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        documento VARCHAR(50) NOT NULL,
        email VARCHAR(255) NOT NULL,
        programa VARCHAR(255) NOT NULL,
        fecha_solicitud DATETIME DEFAULT CURRENT_TIMESTAMP,
        estado ENUM('pendiente', 'aprobada', 'rechazada') DEFAULT 'pendiente'
    )");
    
    // Verificar si ya existe una solicitud pendiente
    $stmt = $conexion->prepare("SELECT id FROM solicitudes_carnet WHERE documento = ? AND estado = 'pendiente'");
    $stmt->execute([$documento]);
    
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Ya tienes una solicitud pendiente']);
        exit;
    }
    
    // Insertar nueva solicitud
    $stmt = $conexion->prepare("INSERT INTO solicitudes_carnet (nombre, documento, email, programa, fecha_solicitud, estado) VALUES (?, ?, ?, ?, NOW(), 'pendiente')");
    $stmt->execute([$nombre, $documento, $email, $programa]);
    
    echo json_encode(['success' => true, 'message' => 'Solicitud enviada exitosamente']);
    
} catch (PDOException $e) {
    error_log("Error en solicitud: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Error interno del servidor']);
}
?>