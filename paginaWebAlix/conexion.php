<?php
$host = "localhost";
$usuario = "root"; // Este es el usuario por defecto en XAMPP
$contrasena = ""; // En XAMPP, la contraseña del root viene vacía por defecto
$base_de_datos = "micredencial";
try {
    // Aquí se crea el puente PDO
    $conexion = new PDO("mysql:host=$host;dbname=$base_de_datos", $usuario, $contrasena);
    
    // Le decimos a PDO que nos muestre los errores si algo falla
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
   // echo "¡Conexión exitosa a MySQL con PDO!";
    
} catch(PDOException $error) {
    // Si la conexión falla, atrapamos el error y lo mostramos en pantalla
    echo "Error de conexión: " . $error->getMessage();
}
?>