<?php
header('Content-Type: application/json');
require_once '../conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input = json_decode(file_get_contents('php://input'), true);
    if(!$input) {
        $input = $_POST;
    }

    $id_usuario = $input['id_usuario'] ?? '';
    $tipo_documento = $input['tipo_documento'] ?? '';
    $nombres = $input['nombres'] ?? '';
    $apellidos = $input['apellidos'] ?? '';
    $email = $input['email'] ?? '';
    $contrasena = $input['contrasena'] ?? '';

    // Validaciones básicas
    if (empty($id_usuario) || empty($tipo_documento) || empty($nombres) || empty($email) || empty($contrasena)) {
        echo json_encode(['success' => false, 'message' => 'Por favor complete todos los campos obligatorios.']);
        exit();
    }

    try {
        // Verificar si el usuario ya existe
        $check_sql = "SELECT id_usuario FROM usuarios WHERE id_usuario = :id_usuario OR email = :email";
        $check_stmt = $conexion->prepare($check_sql);
        $check_stmt->bindParam(':id_usuario', $id_usuario);
        $check_stmt->bindParam(':email', $email);
        $check_stmt->execute();
        
        if ($check_stmt->fetch()) {
            echo json_encode(['success' => false, 'message' => 'El documento o el correo ya se encuentran registrados.']);
            exit();
        }

        // Insertar nuevo usuario
        $insert_sql = "INSERT INTO usuarios (id_usuario, tipo_documento, nombres, apellidos, email, contrasena) 
                       VALUES (:id_usuario, :tipo_documento, :nombres, :apellidos, :email, :contrasena)";
        $insert_stmt = $conexion->prepare($insert_sql);
        $insert_stmt->bindParam(':id_usuario', $id_usuario);
        $insert_stmt->bindParam(':tipo_documento', $tipo_documento);
        $insert_stmt->bindParam(':nombres', $nombres);
        $insert_stmt->bindParam(':apellidos', $apellidos);
        $insert_stmt->bindParam(':email', $email);
        $insert_stmt->bindParam(':contrasena', $contrasena);
        
        if ($insert_stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Usuario registrado exitosamente.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al guardar el usuario en la base de datos.']);
        }

    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error en el sistema: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
}

