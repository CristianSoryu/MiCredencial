<?php
session_start();
header('Content-Type: application/json');

// Si ya hay sesión iniciada, lo indicamos para redirigir
if (isset($_SESSION['usuario_id'])) {
    if (isset($_SESSION['is_admin']) && $_SESSION['is_admin'] === true) {
        echo json_encode(['success' => true, 'redirect' => '../admin/admin.html']);
    } else {
        echo json_encode(['success' => true, 'redirect' => 'carnet.html']);
    }
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
        $sql = "SELECT id_usuario, contrasena, nombres, estado FROM usuarios WHERE id_usuario = :documento";
        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':documento', $documento);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && ($password === $user['contrasena'] || empty($user['contrasena']))) {
            if (isset($user['estado']) && $user['estado'] === 'inactivo') {
                echo json_encode(['success' => false, 'message' => 'Su carnet ha sido desactivado. Por favor, contacte con el administrador.']);
                exit();
            }

            // Guardamos los datos en la sesión
            $_SESSION['usuario_id'] = $user['id_usuario'];
            $_SESSION['usuario_nombre'] = $user['nombres'];
            $_SESSION['usuario_documento'] = $user['id_usuario']; 

            // Verificar si el usuario tiene el rol de administrador
            $sql_roles = "SELECT r.tipo_usuario 
                          FROM usuario_rol ur 
                          JOIN roles r ON ur.id_rol = r.id_rol 
                          WHERE ur.id_usuario = :id";
            $stmt_roles = $conexion->prepare($sql_roles);
            $stmt_roles->bindParam(':id', $user['id_usuario']);
            $stmt_roles->execute();
            $roles = $stmt_roles->fetchAll(PDO::FETCH_COLUMN);

            $is_admin = false;
            foreach ($roles as $rol) {
                if (strtolower(trim($rol)) === 'administrador') {
                    $is_admin = true;
                    break;
                }
            }

            if ($is_admin) {
                $_SESSION['is_admin'] = true;
                echo json_encode(['success' => true, 'redirect' => '../admin/admin.html']);
            } else {
                echo json_encode(['success' => true, 'redirect' => 'carnet.html']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Identificación o contraseña incorrectos.']);
        }
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error en el sistema: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
}

