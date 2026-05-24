<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../config/db.php';

$sql = "SELECT * FROM usuarios";
$result = $conn->query($sql);

$usuarios = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $usuarios[] = $row;
    }
}

echo json_encode($usuarios);