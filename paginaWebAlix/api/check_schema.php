<?php
require 'conexion.php';
$stmt = $conexion->query('SHOW TABLES');
$tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
$schema = [];
foreach ($tables as $table) {
    $stmt = $conexion->query("DESCRIBE `$table`");
    $schema[$table] = $stmt->fetchAll(PDO::FETCH_ASSOC);
}
echo json_encode($schema);
