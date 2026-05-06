<?php

$servername = "localhost";
$username = "root"; 
$password = "";
$dbname = "micredencial";

$conexion = new mysqli($servername, $username, $password, $dbname);

if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
} else {
    echo "Conexión exitosa a la base de datos.";
}
?>