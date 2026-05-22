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
    $programa_academico = $input['programa_academico'] ?? '';

    // Validaciones básicas
    if (empty($id_usuario) || empty($tipo_documento) || empty($nombres) || empty($email) || empty($contrasena)) {
        echo json_encode(['success' => false, 'message' => 'Por favor complete todos los campos obligatorios.']);
        exit();
    }

    // Validar dominio del correo
    if (!str_ends_with($email, '@unilibre.edu.co')) {
        echo json_encode(['success' => false, 'message' => 'El correo debe ser institucional (@unilibre.edu.co).']);
        exit();
    }

    try {
        // 1. Verificar si el usuario se encuentra en el preregistro de los CSV oficiales
        $pre_sql = "SELECT 1 FROM preregistro_oficial WHERE documento = :doc LIMIT 1";
        $pre_stmt = $conexion->prepare($pre_sql);
        $pre_stmt->bindParam(':doc', $id_usuario);
        $pre_stmt->execute();
        $esta_pre = $pre_stmt->fetch();

        // 2. Verificar si cuenta con una solicitud de egresado no graduado
        $egre_sql = "SELECT estado FROM solicitudes_egresados_no_graduados WHERE identificacion = :doc LIMIT 1";
        $egre_stmt = $conexion->prepare($egre_sql);
        $egre_stmt->bindParam(':doc', $id_usuario);
        $egre_stmt->execute();
        $solicitud_egre = $egre_stmt->fetch(PDO::FETCH_ASSOC);

        if (!$esta_pre) {
            if ($solicitud_egre) {
                if ($solicitud_egre['estado'] !== 'aprobado') {
                    echo json_encode(['success' => false, 'message' => 'Su solicitud de egresado no graduado se encuentra ' . $solicitud_egre['estado'] . '. Solo se permite el registro a egresados aprobados.']);
                    exit();
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'No se encuentra en el preregistro oficial de la universidad. Por favor, comuníquese con el administrador.']);
                exit();
            }
        }

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
            // Guardar programa académico en preregistro_oficial si se especificó
            if (!empty($programa_academico)) {
                $check_pre = "SELECT id FROM preregistro_oficial WHERE documento = :doc";
                $stmt_pre = $conexion->prepare($check_pre);
                $stmt_pre->bindParam(':doc', $id_usuario);
                $stmt_pre->execute();
                
                if ($stmt_pre->fetch()) {
                    $up_pre = "UPDATE preregistro_oficial SET programa_academico = :prog, correo = :email WHERE documento = :doc";
                    $stmt_up = $conexion->prepare($up_pre);
                    $stmt_up->bindParam(':prog', $programa_academico);
                    $stmt_up->bindParam(':email', $email);
                    $stmt_up->bindParam(':doc', $id_usuario);
                    $stmt_up->execute();
                } else {
                    $in_pre = "INSERT INTO preregistro_oficial (tipo_documento, documento, nombres, apellidos, correo, programa_academico) 
                               VALUES (:tipo_doc, :doc, :nom, :ape, :email, :prog)";
                    $stmt_in = $conexion->prepare($in_pre);
                    $stmt_in->bindParam(':tipo_doc', $tipo_documento);
                    $stmt_in->bindParam(':doc', $id_usuario);
                    $stmt_in->bindParam(':nom', $nombres);
                    $stmt_in->bindParam(':ape', $apellidos);
                    $stmt_in->bindParam(':email', $email);
                    $stmt_in->bindParam(':prog', $programa_academico);
                    $stmt_in->execute();
                }
            }
            
            // Asignar rol por defecto 'estudiante' al registrarse si no tiene rol
            $check_rol = "SELECT 1 FROM usuario_rol WHERE id_usuario = :id";
            $stmt_rol = $conexion->prepare($check_rol);
            $stmt_rol->bindParam(':id', $id_usuario);
            $stmt_rol->execute();
            if (!$stmt_rol->fetch()) {
                // El rol de estudiante es id_rol = 1
                $ins_rol = "INSERT INTO usuario_rol (id_usuario, id_rol) VALUES (:id, 1)";
                $stmt_ins_rol = $conexion->prepare($ins_rol);
                $stmt_ins_rol->bindParam(':id', $id_usuario);
                $stmt_ins_rol->execute();
            }

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

