<?php
session_start();
header('Content-Type: application/json');

// Si ya hay sesión iniciada, lo indicamos para redirigir
if (isset($_SESSION['usuario_id'])) {
    echo json_encode(['success' => true, 'redirect' => 'carnet.html']);
    exit();
}

require_once '../conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Permitir recibir datos como JSON o como form-data
    $input = json_decode(file_get_contents('php://input'), true);
    if($input) {
        $documento = $input['documento'] ?? '';
        $password = $input['password'] ?? '';
    } else {
        $documento = $_POST['documento'] ?? '';
        $password = $_POST['password'] ?? '';
    }

    if (empty($documento) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Por favor ingrese usuario y contraseña.']);
        exit();
    }

    try {
        $sql = "SELECT id_usuario, contrasena, nombres FROM usuarios WHERE id_usuario = :documento";
        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':documento', $documento);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && ($password === $user['contrasena'] || empty($user['contrasena']))) {
            // Guardamos los datos en la sesión
            $_SESSION['usuario_id'] = $user['id_usuario'];
            $_SESSION['usuario_nombre'] = $user['nombres'];
            $_SESSION['usuario_documento'] = $user['id_usuario']; 
            
            echo json_encode(['success' => true, 'redirect' => 'carnet.html']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Identificación o contraseña incorrectos.']);
        }
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error en el sistema: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
}

