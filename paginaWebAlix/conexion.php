<?php
$host           = "localhost";
$usuario        = "root";
$contrasena     = "";
$base_de_datos  = "micredencial";
$puerto         = 3307;

try {
    $conexion = new PDO("mysql:host=$host;port=$puerto;dbname=$base_de_datos;charset=utf8mb4", $usuario, $contrasena);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $error) {
    echo json_encode(["error" => $error->getMessage()]);
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Conexión a la Base de Datos</title>