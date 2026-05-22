<?php
require_once 'c:/xampp/htdocs/MiCredencial/paginaWebAlix/api/conexion.php';
try {
    $stmt = $conexion->query('SELECT * FROM roles');
    $roles = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($roles, JSON_PRETTY_PRINT);
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
