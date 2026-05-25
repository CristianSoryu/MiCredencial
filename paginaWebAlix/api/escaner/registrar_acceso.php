<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit();
}

require_once '../conexion.php';

// Verificar que el usuario que intenta registrar sea un ESCANEADOR o SEGURIDAD
try {
    $roles_usuario = obtenerRolesUsuario($_SESSION['usuario_id'], $conexion);
    $roles_permitidos = ['escaneador', 'seguridad', 'administrador', 'escaneador de bienestar', 'escaneador de biblioteca'];
    $tiene_permiso = false;
    foreach ($roles_usuario as $r) {
        if (in_array($r, $roles_permitidos)) {
            $tiene_permiso = true;
            break;
        }
    }

    if (!$tiene_permiso) {
        echo json_encode(['success' => false, 'message' => 'No tiene permisos para registrar accesos.']);
        exit();
    }
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error de seguridad: ' . $e->getMessage()]);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $id_usuario = $input['id_usuario'] ?? '';
    $tipo = $input['tipo'] ?? '';
    $metodo = $input['metodo'] ?? '';

    if (empty($id_usuario) || empty($tipo) || empty($metodo)) {
        echo json_encode(['success' => false, 'message' => 'Faltan datos obligatorios para el registro.']);
        exit();
    }

    if (!in_array($tipo, ['entrada', 'salida'])) {
        echo json_encode(['success' => false, 'message' => 'Tipo de registro inválido.']);
        exit();
    }

    if (!in_array($metodo, ['peatonal', 'vehicular'])) {
        echo json_encode(['success' => false, 'message' => 'Método de registro inválido.']);
        exit();
    }

    $id_registrador = $_SESSION['usuario_id'];
    $is_temp = strpos($id_usuario, 'TEMP_') === 0;

    try {
        if ($is_temp) {
            $id_temporal = intval(str_replace('TEMP_', '', $id_usuario));
            
            // Consultar el tipo de visitante (persona o grupo/institución) en la tabla carnets_temporales
            $sql_type = "SELECT tipo FROM carnets_temporales WHERE id_temporal = :id_temp";
            $stmt_type = $conexion->prepare($sql_type);
            $stmt_type->bindParam(':id_temp', $id_temporal);
            $stmt_type->execute();
            $temp_card = $stmt_type->fetch(PDO::FETCH_ASSOC);
            
            $tipo_visitante = 'persona'; // valor por defecto
            if ($temp_card) {
                $tipo_visitante = ($temp_card['tipo'] === 'grupo') ? 'institucion' : 'persona';
            }

            $sql = "INSERT INTO registro_visitantes_temporales (id_temporal, id_registrador, tipo, metodo, tipo_visitante) 
                    VALUES (:id_temporal, :id_registrador, :tipo, :metodo, :tipo_visitante)";
            $stmt = $conexion->prepare($sql);
            $stmt->bindParam(':id_temporal', $id_temporal);
            $stmt->bindParam(':id_registrador', $id_registrador);
            $stmt->bindParam(':tipo', $tipo);
            $stmt->bindParam(':metodo', $metodo);
            $stmt->bindParam(':tipo_visitante', $tipo_visitante);
        } else {
            $sql = "INSERT INTO registro (id_usuario, id_registrador, tipo, metodo) 
                    VALUES (:id_usuario, :id_registrador, :tipo, :metodo)";
            $stmt = $conexion->prepare($sql);
            $stmt->bindParam(':id_usuario', $id_usuario);
            $stmt->bindParam(':id_registrador', $id_registrador);
            $stmt->bindParam(':tipo', $tipo);
            $stmt->bindParam(':metodo', $metodo);
        }

        if ($stmt->execute()) {
            echo json_encode([
                'success' => true, 
                'message' => 'Acceso registrado correctamente.',
                'tipo' => $tipo,
                'metodo' => $metodo
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'No se pudo guardar el registro en la base de datos.']);
        }
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error al registrar acceso: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}

