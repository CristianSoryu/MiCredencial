<?php
require_once "conexion.php";

try {
    // 1. Crear tabla solicitudes_egresados_no_graduados
    $sql1 = "CREATE TABLE IF NOT EXISTS solicitudes_egresados_no_graduados (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombres VARCHAR(150) NOT NULL,
        identificacion VARCHAR(50) NOT NULL,
        correo VARCHAR(150) NOT NULL,
        programa_academico VARCHAR(150) NOT NULL,
        estado ENUM('pendiente', 'aprobado', 'rechazado') DEFAULT 'pendiente',
        fecha_solicitud DATETIME DEFAULT CURRENT_TIMESTAMP
    )";
    $conexion->exec($sql1);
    echo "Tabla solicitudes_egresados_no_graduados creada exitosamente.\n";

    // 2. Crear rol 'admisiones y registro' si no existe
    $sql2 = "SELECT id_rol FROM roles WHERE tipo_usuario = 'admisiones_registro'";
    $stmt = $conexion->query($sql2);
    if ($stmt->rowCount() == 0) {
        // Encontrar el maximo id_rol actual y sumar 1
        $max_id_stmt = $conexion->query("SELECT MAX(id_rol) as max_id FROM roles");
        $max_id_row = $max_id_stmt->fetch(PDO::FETCH_ASSOC);
        $next_id = ($max_id_row['max_id'] ?? 0) + 1;

        $sql3 = "INSERT INTO roles (id_rol, tipo_usuario) VALUES ($next_id, 'admisiones_registro')";
        $conexion->exec($sql3);
        echo "Rol admisiones_registro creado exitosamente con ID $next_id.\n";
    } else {
        echo "Rol admisiones_registro ya existe.\n";
    }

} catch(PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
