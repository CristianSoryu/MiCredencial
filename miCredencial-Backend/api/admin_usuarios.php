<?php
require_once '../config/db.php';
initApiHeaders("GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $id_admin = trim($_GET['id_admin'] ?? '');
    if (!$id_admin) {
        echo json_encode(["success" => false, "message" => "No autorizado"]);
        exit;
    }

    $rolesInfo = obtenerRolesUsuario($conn, $id_admin);
    if (!in_array('administrador', $rolesInfo['expanded'])) {
        echo json_encode(["success" => false, "message" => "Requiere rol de administrador."]);
        $conn->close();
        exit;
    }

    $uRes = $conn->query("
        SELECT u.id_usuario, u.nombres, u.apellidos, u.email, u.estado,
               COALESCE(r.tipo_usuario, 'estudiante') AS rol,
               COALESCE(r.id_rol, 1) AS id_rol
        FROM usuarios u
        LEFT JOIN usuario_rol ur ON u.id_usuario = ur.id_usuario
        LEFT JOIN roles r ON ur.id_rol = r.id_rol
        ORDER BY u.apellidos, u.nombres
    ");
    $usuarios = [];
    while ($row = $uRes->fetch_assoc()) {
        $usuarios[] = $row;
    }

    $rRes = $conn->query("SELECT id_rol, tipo_usuario FROM roles ORDER BY id_rol ASC");
    $roles = [];
    while ($rRow = $rRes->fetch_assoc()) {
        $roles[] = $rRow;
    }

    echo json_encode(["success" => true, "usuarios" => $usuarios, "roles" => $roles]);
    $conn->close();
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    $id_admin = trim($input['id_admin'] ?? '');
    $id_usuario = trim($input['id_usuario'] ?? '');
    $accion = trim($input['accion'] ?? '');

    if (!$id_admin || !$id_usuario || !$accion) {
        echo json_encode(["success" => false, "message" => "Datos incompletos."]);
        exit;
    }

    $rolesInfo = obtenerRolesUsuario($conn, $id_admin);
    if (!in_array('administrador', $rolesInfo['expanded'])) {
        echo json_encode(["success" => false, "message" => "Requiere rol de administrador."]);
        $conn->close();
        exit;
    }

    if ($accion === 'toggle_estado') {
        $sel = $conn->prepare("SELECT estado FROM usuarios WHERE id_usuario = ? LIMIT 1");
        $sel->bind_param("s", $id_usuario);
        $sel->execute();
        $row = $sel->get_result()->fetch_assoc();
        $sel->close();

        if (!$row) {
            echo json_encode(["success" => false, "message" => "Usuario no encontrado."]);
            exit;
        }

        $nuevo = ($row['estado'] === 'activo') ? 'inactivo' : 'activo';
        $up = $conn->prepare("UPDATE usuarios SET estado = ? WHERE id_usuario = ?");
        $up->bind_param("ss", $nuevo, $id_usuario);
        $up->execute();
        $up->close();

        crearNotificacion(
            $conn,
            $id_usuario,
            "Estado de carnet actualizado",
            "Un administrador cambió el estado de tu carnet a: " . strtoupper($nuevo) . ".",
            $nuevo === 'activo' ? 'exito' : 'alerta'
        );

        echo json_encode(["success" => true, "nuevo_estado" => $nuevo, "message" => "Estado cambiado a $nuevo."]);
        $conn->close();
        exit;
    }

    if ($accion === 'cambiar_rol') {
        $id_rol = intval($input['id_rol'] ?? 0);
        if ($id_rol <= 0) {
            echo json_encode(["success" => false, "message" => "Rol inválido."]);
            exit;
        }

        $conn->begin_transaction();
        try {
            $del = $conn->prepare("DELETE FROM usuario_rol WHERE id_usuario = ?");
            $del->bind_param("s", $id_usuario);
            $del->execute();
            $del->close();

            $ins = $conn->prepare("INSERT INTO usuario_rol (id_usuario, id_rol) VALUES (?, ?)");
            $ins->bind_param("si", $id_usuario, $id_rol);
            $ins->execute();
            $ins->close();

            $conn->commit();
            echo json_encode(["success" => true, "message" => "Rol actualizado correctamente."]);
        } catch (Throwable $e) {
            $conn->rollback();
            echo json_encode(["success" => false, "message" => "Error al actualizar rol: " . $e->getMessage()]);
        }
        $conn->close();
        exit;
    }

    echo json_encode(["success" => false, "message" => "Acción desconocida."]);
    $conn->close();
}
?>
