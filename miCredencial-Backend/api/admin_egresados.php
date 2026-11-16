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
    if (!in_array('administrador', $rolesInfo['expanded']) && !in_array('admisiones_registro', $rolesInfo['expanded'])) {
        echo json_encode(["success" => false, "message" => "No tiene permisos para ver solicitudes."]);
        $conn->close();
        exit;
    }

    $res = $conn->query("
        SELECT id, nombres, identificacion, correo, programa_academico, estado,
               DATE_FORMAT(fecha_solicitud, '%Y-%m-%d %h:%i %p') AS fecha_solicitud
        FROM solicitudes_egresados_no_graduados
        ORDER BY FIELD(estado, 'pendiente', 'aprobado', 'rechazado'), id DESC
    ");

    $solicitudes = [];
    while ($row = $res->fetch_assoc()) {
        $solicitudes[] = $row;
    }

    echo json_encode(["success" => true, "solicitudes" => $solicitudes]);
    $conn->close();
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    $id_admin = trim($input['id_admin'] ?? '');
    $id = intval($input['id'] ?? 0);
    $estado = trim($input['estado'] ?? '');

    if (!$id_admin || !$id || !in_array($estado, ['aprobado', 'rechazado'])) {
        echo json_encode(["success" => false, "message" => "Datos incompletos o inválidos."]);
        exit;
    }

    $rolesInfo = obtenerRolesUsuario($conn, $id_admin);
    if (!in_array('administrador', $rolesInfo['expanded']) && !in_array('admisiones_registro', $rolesInfo['expanded'])) {
        echo json_encode(["success" => false, "message" => "Sin permisos."]);
        $conn->close();
        exit;
    }

    $conn->begin_transaction();
    try {
        $up = $conn->prepare("UPDATE solicitudes_egresados_no_graduados SET estado = ? WHERE id = ?");
        $up->bind_param("si", $estado, $id);
        $up->execute();
        $up->close();

        if ($estado === 'aprobado') {
            $sel = $conn->prepare("SELECT nombres, identificacion, correo, programa_academico FROM solicitudes_egresados_no_graduados WHERE id = ? LIMIT 1");
            $sel->bind_param("i", $id);
            $sel->execute();
            $sol = $sel->get_result()->fetch_assoc();
            $sel->close();

            if ($sol) {
                $chk = $conn->prepare("SELECT id FROM preregistro_oficial WHERE documento = ? LIMIT 1");
                $chk->bind_param("s", $sol['identificacion']);
                $chk->execute();
                $exists = $chk->get_result()->fetch_assoc();
                $chk->close();

                if (!$exists) {
                    $inPre = $conn->prepare("
                        INSERT INTO preregistro_oficial (tipo_documento, documento, nombres, apellidos, correo, programa_academico)
                        VALUES ('CC', ?, ?, '', ?, ?)
                    ");
                    $inPre->bind_param("ssss", $sol['identificacion'], $sol['nombres'], $sol['correo'], $sol['programa_academico']);
                    $inPre->execute();
                    $inPre->close();
                }

                // Notificar si el usuario ya tiene cuenta
                $uChk = $conn->prepare("SELECT id_usuario FROM usuarios WHERE id_usuario = ? LIMIT 1");
                $uChk->bind_param("s", $sol['identificacion']);
                $uChk->execute();
                if ($uChk->get_result()->fetch_assoc()) {
                    crearNotificacion($conn, $sol['identificacion'], "Solicitud de Egresado Aprobada", "Tu solicitud de carnet como egresado no graduado ha sido aprobada.", "exito");
                }
                $uChk->close();
            }
        }

        $conn->commit();
        echo json_encode(["success" => true, "message" => "Solicitud actualizada a $estado."]);
    } catch (Throwable $e) {
        $conn->rollback();
        echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
    }
    $conn->close();
}
?>
