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

            // Obtener roles centralizados del usuario
            $roles = obtenerRolesUsuario($user['id_usuario'], $conexion);

            // Definir roles administrativos/staff que se exceptúan del control de preregistro
            $staff_roles = ['administrador', 'seguridad', 'admisiones_registro', 'biblioteca', 'bienestar', 'escaneador', 'escaneador de biblioteca', 'escaneador de bienestar', 'administrativo'];

            // Verificar si el usuario es staff/administrativo
            $es_staff = false;
            foreach ($roles as $rol) {
                if (in_array(strtolower(trim($rol)), $staff_roles)) {
                    $es_staff = true;
                    break;
                }
            }

            if (!$es_staff) {
                // 1. Verificar si el usuario se encuentra en el preregistro de los CSV oficiales
                $pre_sql = "SELECT 1 FROM preregistro_oficial WHERE documento = :doc LIMIT 1";
                $pre_stmt = $conexion->prepare($pre_sql);
                $pre_stmt->bindParam(':doc', $user['id_usuario']);
                $pre_stmt->execute();
                $esta_pre = $pre_stmt->fetch();

                // 2. Verificar si cuenta con una solicitud de egresado no graduado
                $egre_sql = "SELECT estado FROM solicitudes_egresados_no_graduados WHERE identificacion = :doc LIMIT 1";
                $egre_stmt = $conexion->prepare($egre_sql);
                $egre_stmt->bindParam(':doc', $user['id_usuario']);
                $egre_stmt->execute();
                $solicitud_egre = $egre_stmt->fetch(PDO::FETCH_ASSOC);

                if (!$esta_pre) {
                    if ($solicitud_egre) {
                        if ($solicitud_egre['estado'] !== 'aprobado') {
                            echo json_encode(['success' => false, 'message' => 'Su acceso está deshabilitado. Su solicitud de egresado no graduado se encuentra ' . $solicitud_egre['estado'] . '.']);
                            exit();
                        }
                    } else {
                        echo json_encode(['success' => false, 'message' => 'Su acceso está deshabilitado. No se encuentra registrado en el preregistro oficial de la universidad.']);
                        exit();
                    }
                }
            }

            // Guardamos los datos en la sesión
            $_SESSION['usuario_id'] = $user['id_usuario'];
            $_SESSION['usuario_nombre'] = $user['nombres'];
            $_SESSION['usuario_documento'] = $user['id_usuario']; 

            // Verificar si el usuario tiene el rol de administrador para la redirección
            $is_admin = in_array('administrador', $roles);

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

