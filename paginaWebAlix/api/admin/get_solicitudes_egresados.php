<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['usuario_id']) || !isset($_SESSION['is_admin'])) {
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit();
}

require_once '../conexion.php';

$id_usuario = $_SESSION['usuario_id'];

try {
    // Verificar que tenga el rol adecuado
    $sql_roles = "SELECT r.tipo_usuario 
                  FROM usuario_rol ur 
                  JOIN roles r ON ur.id_rol = r.id_rol 
                  WHERE ur.id_usuario = :id";
    $stmt_roles = $conexion->prepare($sql_roles);
    $stmt_roles->bindParam(':id', $id_usuario);
    $stmt_roles->execute();
    $roles_db = $stmt_roles->fetchAll(PDO::FETCH_ASSOC);

    $tiene_permiso = false;
    foreach ($roles_db as $r) {
        $rol = strtolower($r['tipo_usuario']);
        if ($rol === 'administrador' || $rol === 'admisiones_registro') {
            $tiene_permiso = true;
            break;
        }
    }

    if (!$tiene_permiso) {
        echo json_encode(['success' => false, 'message' => 'No tiene permisos para ver esta sección']);
        exit();
    }

    // Obtener solicitudes
    $sql = "SELECT id, nombres, identificacion, correo, programa_academico, estado, fecha_solicitud 
            FROM solicitudes_egresados_no_graduados 
            ORDER BY fecha_solicitud DESC";
    $stmt = $conexion->query($sql);
    $solicitudes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'solicitudes' => $solicitudes]);

} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error en el sistema: ' . $e->getMessage()]);
}
?>
