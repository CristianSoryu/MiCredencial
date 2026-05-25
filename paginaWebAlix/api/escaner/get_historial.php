<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit();
}

require_once '../conexion.php';

try {
    // Verificar que el usuario tenga el rol de ESCANEADOR o ADMINISTRADOR (incluyendo herencia de seguridad/administrador)
    $roles_usuario = obtenerRolesUsuario($_SESSION['usuario_id'], $conexion);
    $tiene_permiso = in_array('escaneador', $roles_usuario) || in_array('administrador', $roles_usuario);

    if (!$tiene_permiso) {
        echo json_encode(['success' => false, 'message' => 'No tiene permisos para ver el historial.']);
        exit();
    }

    // Recoger parámetros de filtrado
    $fecha = $_GET['fecha'] ?? '';
    $documento = $_GET['documento'] ?? '';
    $metodo = $_GET['metodo'] ?? '';
    $tipo = $_GET['tipo'] ?? '';

    // Construir la consulta combinada con UNION ALL
    $sql = "SELECT * FROM (
                SELECT 
                    r.id_registro AS id, 
                    CAST(r.id_usuario AS CHAR) AS id_usuario, 
                    u.nombres AS nombres, 
                    u.apellidos AS apellidos, 
                    r.tipo AS tipo, 
                    r.metodo AS metodo, 
                    r.fecha_registro AS fecha_registro
                FROM registro r
                JOIN usuarios u ON r.id_usuario = u.id_usuario

                UNION ALL

                SELECT 
                    rvt.id_registro_temp AS id, 
                    COALESCE(ct.documento, 'GRUPO / INSTITUCIÓN') AS id_usuario, 
                    ct.nombre AS nombres, 
                    CASE 
                        WHEN COALESCE(rvt.tipo_visitante, ct.tipo) = 'grupo' OR COALESCE(rvt.tipo_visitante, ct.tipo) = 'institucion' THEN '(Institución Temporal)'
                        ELSE '(Persona Temporal)'
                    END AS apellidos, 
                    rvt.tipo AS tipo, 
                    rvt.metodo AS metodo, 
                    rvt.fecha_hora AS fecha_registro
                FROM registro_visitantes_temporales rvt
                JOIN carnets_temporales ct ON rvt.id_temporal = ct.id_temporal
            ) AS combined
            WHERE 1=1";
    
    $params = [];

    if (!empty($fecha)) {
        $sql .= " AND DATE(combined.fecha_registro) = :fecha";
        $params[':fecha'] = $fecha;
    }

    if (!empty($documento)) {
        $sql .= " AND (combined.id_usuario = :documento OR combined.id_usuario LIKE :documento_like)";
        $params[':documento'] = $documento;
        $params[':documento_like'] = '%' . $documento . '%';
    }

    if (!empty($metodo)) {
        $sql .= " AND combined.metodo = :metodo";
        $params[':metodo'] = $metodo;
    }

    if (!empty($tipo)) {
        $sql .= " AND combined.tipo = :tipo";
        $params[':tipo'] = $tipo;
    }

    $sql .= " ORDER BY combined.fecha_registro DESC LIMIT 500"; // Límite razonable para no saturar

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
