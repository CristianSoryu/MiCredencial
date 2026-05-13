<?php
require 'conexion.php';

try {
    // 1. Verificar/Crear el rol ESCANEADOR
    $stmt = $conexion->query("SELECT id_rol FROM roles WHERE tipo_usuario = 'escaneador'");
    $rol = $stmt->fetch();
    
    if (!$rol) {
        $conexion->exec("INSERT INTO roles (tipo_usuario) VALUES ('escaneador')");
        echo "Rol ESCANEADOR creado.\n";
    } else {
        echo "Rol ESCANEADOR ya existe.\n";
    }

    // 2. Modificar tabla registro para incluir id_registrador
    // Primero vemos si ya existe la columna
    $stmt = $conexion->query("SHOW COLUMNS FROM registro LIKE 'id_registrador'");
    if (!$stmt->fetch()) {
        $conexion->exec("ALTER TABLE registro ADD COLUMN id_registrador VARCHAR(50) NULL AFTER id_usuario");
        echo "Columna id_registrador añadida a la tabla registro.\n";
    } else {
        echo "Columna id_registrador ya existe.\n";
    }

    // 3. Asegurar que existe la columna fecha_registro
    $stmt = $conexion->query("SHOW COLUMNS FROM registro LIKE 'fecha_registro'");
    if (!$stmt->fetch()) {
        $conexion->exec("ALTER TABLE registro ADD COLUMN fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER metodo");
        echo "Columna fecha_registro añadida.\n";
    }

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
