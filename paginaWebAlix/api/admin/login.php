<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['usuario_id']) && isset($_SESSION['is_admin'])) {
    echo json_encode(['success' => true, 'redirect' => 'admin.html']);
    exit();
}

require_once '../conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input = json_decode(file_get_contents('php://input'), true);
    if($input) {
        $username = $input['username'] ?? '';
        $password = $input['password'] ?? '';
    } else {
        $username = $_POST['username'] ?? '';
        $password = $_POST['password'] ?? '';
    }

    if (empty($username) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Por favor ingrese usuario y contraseña.']);
        exit();
    }

    try {
        $sql = "SELECT id_usuario, contrasena, nombres FROM usuarios WHERE user_handle = :username OR email = :username";
        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':username', $username);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && ($password === $user['contrasena'] || empty($user['contrasena']))) {
            $_SESSION['usuario_id'] = $user['id_usuario'];
            $_SESSION['usuario_nombre'] = $user['nombres'];
            $_SESSION['is_admin'] = true; // Flag simple para simular admin
            
            echo json_encode(['success' => true, 'redirect' => 'admin.html']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Usuario o contraseña incorrectos.']);
        }
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error en el sistema: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
}

