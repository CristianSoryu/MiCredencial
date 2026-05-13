<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit();
}

require_once '../conexion.php';

// Verificar que el usuario que intenta escanear sea un ESCANEADOR
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
        echo json_encode(['success' => false, 'message' => 'No tiene permisos para realizar escaneos.']);
        exit();
    }
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error de seguridad: ' . $e->getMessage()]);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input = json_decode(file_get_contents('php://input'), true);
    $qr_data = $input['qr_data'] ?? '';

    if (empty($qr_data)) {
        echo json_encode(['success' => false, 'message' => 'Datos QR vacíos.']);
        exit();
    }

    // El QR viene en Base64 con el formato "documento_fechaISO"
    $decoded = base64_decode($qr_data, true);
    
    if ($decoded === false) {
        echo json_encode(['success' => false, 'message' => 'Formato de QR inválido.']);
        exit();
    }

    $parts = explode('_', $decoded);
    if (count($parts) < 2) {
        echo json_encode(['success' => false, 'message' => 'Estructura de QR inválida.']);
        exit();
    }

    $id_usuario = $parts[0];

    try {
        $sql = "SELECT u.nombres, u.apellidos, u.tipo_documento, u.id_usuario, u.foto, r.tipo_usuario 
                FROM usuarios u 
                LEFT JOIN usuario_rol ur ON u.id_usuario = ur.id_usuario 
                LEFT JOIN roles r ON ur.id_rol = r.id_rol 
                WHERE u.id_usuario = :id";
        
        $consulta = $conexion->prepare($sql);
        $consulta->bindParam(':id', $id_usuario);
        $consulta->execute();
        
        $usuario = $consulta->fetch(PDO::FETCH_ASSOC);

        if ($usuario) {
            echo json_encode([
                'success' => true,
                'usuario' => [
                    'id_usuario' => $usuario['id_usuario'],
                    'nombre_completo' => strtoupper($usuario['nombres'] . ' ' . $usuario['apellidos']),
                    'identificacion' => $usuario['tipo_documento'] . ' ' . $usuario['id_usuario'],
                    'foto' => $usuario['foto'],
                    'rol' => $usuario['tipo_usuario'] ?? 'estudiante'
                ]
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Usuario no encontrado en el sistema.']);
        }
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error en la base de datos: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
