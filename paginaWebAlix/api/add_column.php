<?php
require 'conexion.php';
try {
    $conexion->exec("ALTER TABLE preregistro_oficial ADD COLUMN correo VARCHAR(100) NULL AFTER apellidos");
    echo "Column added successfully";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
