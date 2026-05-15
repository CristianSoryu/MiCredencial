<?php
require_once "conexion.php";
$stmt = $conexion->query("SELECT * FROM roles");
$roles = $stmt->fetchAll(PDO::FETCH_ASSOC);
print_r($roles);
?>
