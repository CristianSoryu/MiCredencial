<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['usuario_id']) || !isset($_SESSION['is_admin'])) {
    echo json_encode(['success' => false, 'redirect' => 'login.html']);
} else {
    echo json_encode(['success' => true]);
}

