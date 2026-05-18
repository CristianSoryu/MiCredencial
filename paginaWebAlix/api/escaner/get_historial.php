<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit();
}

require_once '../conexion.php';

try {
    // Verificar que el usuario tenga el rol de ESCANEADOR
    $sql_check = "SELECT 1 
                  FROM usuario_rol ur 
                  JOIN roles r ON ur.id_rol = r.id_rol 
                  WHERE ur.id_usuario = :id AND r.tipo_usuario = 'escaneador'";
    $stmt_check = $conexion->prepare($sql_check);
    $stmt_check->bindParam(':id', $_SESSION['usuario_id']);
    $stmt_check->execute();
    $tiene_permiso = $stmt_check->fetch();

    if (!$tiene_permiso) {
        echo json_encode(['success' => false, 'message' => 'No tiene permisos para ver el historial.']);
        exit();
    }

    // Recoger parámetros de filtrado
    $fecha = $_GET['fecha'] ?? '';
    $documento = $_GET['documento'] ?? '';
    $metodo = $_GET['metodo'] ?? '';
    $tipo = $_GET['tipo'] ?? '';

    // Construir la consulta
    $sql = "SELECT r.id_registro, r.id_usuario, u.nombres, u.apellidos, r.tipo, r.metodo, r.fecha_registro 
            FROM registro r
            JOIN usuarios u ON r.id_usuario = u.id_usuario
            WHERE 1=1";
    
    $params = [];

    if (!empty($fecha)) {
        $sql .= " AND DATE(r.fecha_registro) = :fecha";
        $params[':fecha'] = $fecha;
    }

    if (!empty($documento)) {
        $sql .= " AND r.id_usuario = :documento";
        $params[':documento'] = $documento;
    }

    if (!empty($metodo)) {
        $sql .= " AND r.metodo = :metodo";
        $params[':metodo'] = $metodo;
    }

    if (!empty($tipo)) {
        $sql .= " AND r.tipo = :tipo";
        $params[':tipo'] = $tipo;
    }

    $sql .= " ORDER BY r.fecha_registro DESC LIMIT 500"; // Límite razonable para no saturar

    $stmt = $conexion->prepare($sql);
    foreach ($params as $key => &$val) {
        $stmt->bindParam($key, $val);
    }
    
    $stmt->execute();
    $historial = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'historial' => $historial]);

} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error de servidor: ' . $e->getMessage()]);
}
?>
