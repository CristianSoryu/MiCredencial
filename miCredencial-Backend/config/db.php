<?php
$host = "localhost";
$usuario = "root";
$password = "";
$bd = "micredencial";
$puerto = 3307;

$conn = new mysqli($host, $usuario, $password, $bd, $puerto);

if ($conn->connect_error) {
    die(json_encode(["error" => "Conexión fallida: " . $conn->connect_error]));
}

$conn->set_charset("utf8mb4");
?>