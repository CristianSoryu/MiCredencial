<?php
require_once '../config/db.php';
initApiHeaders("GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $id_usuario = trim($_GET['id_usuario'] ?? '');
    if (!$id_usuario) {
        echo json_encode(["success" => false, "message" => "id_usuario requerido"]);
        exit;
    }

    $stmt = $conn->prepare("
        SELECT id_notificacion, titulo, mensaje, tipo, leida,
               DATE_FORMAT(fecha_creacion, '%Y-%m-%d %h:%i %p') AS fecha
        FROM notificaciones
        WHERE id_usuario = ?
        ORDER BY leida ASC, id_notificacion DESC
        LIMIT 30
    ");
    $stmt->bind_param("s", $id_usuario);
    $stmt->execute();
    $res = $stmt->get_result();

    $notificaciones = [];
    $no_leidas = 0;
    while ($row = $res->fetch_assoc()) {
        $row['leida'] = (bool)$row['leida'];
        if (!$row['leida']) $no_leidas++;
        $notificaciones[] = $row;
    }
    $stmt->close();

    echo json_encode([
        "success" => true,
        "no_leidas" => $no_leidas,
        "notificaciones" => $notificaciones
    ]);
    $conn->close();
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    $id_usuario = trim($input['id_usuario'] ?? '');
    $id_notificacion = intval($input['id_notificacion'] ?? 0);
    $accion = trim($input['accion'] ?? 'leer');

    if (!$id_usuario) {
        echo json_encode(["success" => false, "message" => "id_usuario requerido"]);
        exit;
    }

    if ($accion === 'leer_todas') {
        $stmt = $conn->prepare("UPDATE notificaciones SET leida = 1 WHERE id_usuario = ?");
        $stmt->bind_param("s", $id_usuario);
        $stmt->execute();
        $stmt->close();
    } elseif ($id_notificacion > 0) {
        $stmt = $conn->prepare("UPDATE notificaciones SET leida = 1 WHERE id_notificacion = ? AND id_usuario = ?");
        $stmt->bind_param("is", $id_notificacion, $id_usuario);
        $stmt->execute();
        $stmt->close();
    }

    echo json_encode(["success" => true, "message" => "Notificación actualizada."]);
    $conn->close();
    exit;
}
?>
