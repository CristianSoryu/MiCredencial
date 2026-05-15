<?php
require_once "conexion.php";
$stmt = $conexion->query("SHOW TABLES");
$tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
foreach($tables as $table) {
    echo "Table: $table\n";
    $stmt2 = $conexion->query("DESCRIBE $table");
    $cols = $stmt2->fetchAll(PDO::FETCH_ASSOC);
    foreach($cols as $col) {
        echo "  " . $col['Field'] . " - " . $col['Type'] . "\n";
    }
}
?>
