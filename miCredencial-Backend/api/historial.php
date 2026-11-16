<?php
require_once '../config/db.php';
initApiHeaders("GET, OPTIONS");

$id_operador = trim($_GET['id_usuario'] ?? '');
$documento = trim($_GET['documento'] ?? '');
$tipo = trim($_GET['tipo'] ?? '');
$metodo = trim($_GET['metodo'] ?? '');
$fecha = trim($_GET['fecha'] ?? '');

if (!$id_operador) {
    echo json_encode(["success" => false, "message" => "No autorizado"]);
    exit;
}

$rolesInfo = obtenerRolesUsuario($conn, $id_operador);
if (!in_array('escaneador', $rolesInfo['expanded']) && !in_array('administrador', $rolesInfo['expanded'])) {
    echo json_encode(["success" => false, "message" => "No tiene permisos para ver el historial."]);
    $conn->close();
    exit;
}

$sql = "
    SELECT * FROM (
        SELECT r.id_registro AS id,
               CAST(r.id_usuario AS CHAR) AS documento,
               CONCAT(u.nombres, ' ', u.apellidos) AS nombre,
               r.tipo,
               r.metodo,
               DATE_FORMAT(r.fecha_registro, '%Y-%m-%d %h:%i %p') AS fecha_formateada,
               r.fecha_registro AS fecha_orden
        FROM registro r
        JOIN usuarios u ON r.id_usuario = u.id_usuario

        UNION ALL

        SELECT rvt.id_registro_temp AS id,
               COALESCE(ct.documento, 'GRUPO') AS documento,
               CONCAT(ct.nombre, IF(ct.tipo = 'grupo', ' (Institución)', ' (Visitante)')) AS nombre,
               rvt.tipo,
               rvt.metodo,
               DATE_FORMAT(rvt.fecha_hora, '%Y-%m-%d %h:%i %p') AS fecha_formateada,
               rvt.fecha_hora AS fecha_orden
        FROM registro_visitantes_temporales rvt
        JOIN carnets_temporales ct ON rvt.id_temporal = ct.id_temporal
    ) AS combined
    WHERE 1=1
";

$params = [];
$types = "";

if ($fecha !== '') {
    $sql .= " AND DATE(combined.fecha_orden) = ?";
    $types .= "s";
    $params[] = $fecha;
}
if ($documento !== '') {
    $sql .= " AND (combined.documento LIKE ? OR combined.nombre LIKE ?)";
    $types .= "ss";
    $like = "%" . $documento . "%";
    $params[] = $like;
    $params[] = $like;
}
if ($tipo !== '' && in_array($tipo, ['entrada', 'salida'])) {
    $sql .= " AND combined.tipo = ?";
    $types .= "s";
    $params[] = $tipo;
}
if ($metodo !== '' && in_array($metodo, ['peatonal', 'vehicular'])) {
    $sql .= " AND combined.metodo = ?";
    $types .= "s";
    $params[] = $metodo;
}

$sql .= " ORDER BY combined.fecha_orden DESC LIMIT 200";

$stmt = $conn->prepare($sql);
if ($types !== "") {
    $stmt->bind_param($types, ...$params);
}
$stmt->execute();
$res = $stmt->get_result();

$historial = [];
while ($row = $res->fetch_assoc()) {
    $historial[] = $row;
}
$stmt->close();

echo json_encode(["success" => true, "historial" => $historial]);
$conn->close();
?>
