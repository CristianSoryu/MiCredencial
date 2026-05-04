<?php
// 1. Traemos el puente de conexión que ya funciona
require_once 'conexion.php';

echo "<h2>Usuarios registrados en MiCredencial:</h2>";

try {
    // 2. Escribimos la consulta SQL (vamos a traer los datos de Cristian)
    $sql = "SELECT nombres, apellidos, tipo_documento, id_usuario FROM usuarios";
    
    // 3. Ejecutamos la consulta a través de PDO
    $resultado = $conexion->query($sql);
    
    // 4. Recorremos los datos encontrados y los mostramos en pantalla
    echo "<ul>";
    while ($fila = $resultado->fetch(PDO::FETCH_ASSOC)) {
        echo "<li>";
        echo "<strong>Nombre:</strong> " . $fila['nombres'] . " " . $fila['apellidos'] . " <br>";
        echo "<strong>Documento:</strong> " . $fila['tipo_documento'] . " " . $fila['id_usuario'];
        echo "</li><br>";
    }
    echo "</ul>";

} catch(PDOException $error) {
    echo "Hubo un problema con la consulta: " . $error->getMessage();
}
?>
