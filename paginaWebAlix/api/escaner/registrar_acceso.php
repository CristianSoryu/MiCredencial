<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit();
}

require_once '../conexion.php';

// Verificar que el usuario que intenta registrar sea un ESCANEADOR
try {
    $sql_check = "SELECT 1 
                  FROM usuario_rol ur 
                  JOIN roles r ON ur.id_rol = r.id_rol 
                  WHERE ur.id_usuario = :id AND r.tipo_usuario = 'escaneador'";
    $stmt_check = $conexion->prepare($sql_check);
    $stmt_check->bindParam(':id', $_SESSION['usuario_id']);
    $stmt_check->execute();
    $tiene_permiso = $stmt_check->fetch();

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

    try {
        $sql = "INSERT INTO registro (id_usuario, id_registrador, tipo, metodo) 
                VALUES (:id_usuario, :id_registrador, :tipo, :metodo)";
        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':id_usuario', $id_usuario);
        $stmt->bindParam(':id_registrador', $id_registrador);
        $stmt->bindParam(':tipo', $tipo);
        $stmt->bindParam(':metodo', $metodo);

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
