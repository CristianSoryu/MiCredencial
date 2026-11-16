<?php
require_once '../config/db.php';
initApiHeaders("GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $id_usuario = trim($_GET['id_usuario'] ?? '');
    $modo = trim($_GET['modo'] ?? 'mis_prestamos'); // 'mis_prestamos' o 'gestion'

    if (!$id_usuario) {
        echo json_encode(["success" => false, "message" => "id_usuario requerido"]);
        exit;
    }

    if ($modo === 'gestion') {
        $rolesInfo = obtenerRolesUsuario($conn, $id_usuario);
        $expanded = $rolesInfo['expanded'];
        $esGestor = in_array('administrador', $expanded) || in_array('bienestar', $expanded) || in_array('biblioteca', $expanded);

        if (!$esGestor) {
            echo json_encode(["success" => false, "message" => "No tiene permisos para gestionar préstamos."]);
            $conn->close();
            exit;
        }

        // Filtrar por área si no es administrador
        $filtroArea = "";
        if (!in_array('administrador', $expanded)) {
            $areas = [];
            if (in_array('bienestar', $expanded)) $areas[] = "'bienestar'";
            if (in_array('biblioteca', $expanded)) $areas[] = "'biblioteca'";
            if (!empty($areas)) {
                $filtroArea = "WHERE p.area IN (" . implode(',', $areas) . ")";
            }
        }

        $sql = "
            SELECT p.id_prestamo, p.id_usuario, p.area, p.elemento, p.estado, p.observaciones,
                   DATE_FORMAT(p.fecha_solicitud, '%Y-%m-%d %h:%i %p') AS fecha_solicitud,
                   DATE_FORMAT(p.fecha_prestamo, '%Y-%m-%d %h:%i %p') AS fecha_prestamo,
                   DATE_FORMAT(p.fecha_vencimiento, '%Y-%m-%d %h:%i %p') AS fecha_vencimiento,
                   CONCAT(u.nombres, ' ', u.apellidos) AS solicitante,
                   u.email AS solicitante_email
            FROM prestamos p
            JOIN usuarios u ON p.id_usuario = u.id_usuario
            $filtroArea
            ORDER BY FIELD(p.estado, 'pendiente', 'vencido', 'activo', 'devuelto', 'rechazado'), p.id_prestamo DESC
            LIMIT 100
        ";
        $res = $conn->query($sql);
        $prestamos = [];
        while ($row = $res->fetch_assoc()) {
            $prestamos[] = $row;
        }
        echo json_encode(["success" => true, "prestamos" => $prestamos]);
        $conn->close();
        exit;
    }

    // Mis préstamos
    $stmt = $conn->prepare("
        SELECT id_prestamo, area, elemento, estado, observaciones,
               DATE_FORMAT(fecha_solicitud, '%Y-%m-%d %h:%i %p') AS fecha_solicitud,
               DATE_FORMAT(fecha_vencimiento, '%Y-%m-%d %h:%i %p') AS fecha_vencimiento
        FROM prestamos
        WHERE id_usuario = ?
        ORDER BY id_prestamo DESC
        LIMIT 30
    ");
    $stmt->bind_param("s", $id_usuario);
    $stmt->execute();
    $res = $stmt->get_result();
    $prestamos = [];
    while ($row = $res->fetch_assoc()) {
        $prestamos[] = $row;
    }
    $stmt->close();

    echo json_encode(["success" => true, "prestamos" => $prestamos]);
    $conn->close();
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    $accion = trim($input['accion'] ?? 'solicitar');

    if ($accion === 'solicitar') {
        $id_usuario = trim($input['id_usuario'] ?? '');
        $area = trim($input['area'] ?? 'bienestar');
        $elemento = trim($input['elemento'] ?? '');
        $observaciones = trim($input['observaciones'] ?? '');

        if (!$id_usuario || !$elemento || !in_array($area, ['bienestar', 'biblioteca'])) {
            echo json_encode(["success" => false, "message" => "Datos incompletos para solicitar préstamo."]);
            exit;
        }

        // Evitar solicitudes duplicadas pendientes del mismo elemento
        $dup = $conn->prepare("SELECT 1 FROM prestamos WHERE id_usuario = ? AND elemento = ? AND estado IN ('pendiente', 'activo') LIMIT 1");
        $dup->bind_param("ss", $id_usuario, $elemento);
        $dup->execute();
        if ($dup->get_result()->fetch_assoc()) {
            $dup->close();
            echo json_encode(["success" => false, "message" => "Ya tienes una solicitud pendiente o préstamo activo para '$elemento'."]);
            exit;
        }
        $dup->close();

        $stmt = $conn->prepare("
            INSERT INTO prestamos (id_usuario, area, elemento, estado, observaciones)
            VALUES (?, ?, ?, 'pendiente', ?)
        ");
        $stmt->bind_param("ssss", $id_usuario, $area, $elemento, $observaciones);

        if ($stmt->execute()) {
            crearNotificacion(
                $conn,
                $id_usuario,
                "Solicitud de préstamo enviada",
                "Solicitaste '$elemento' en " . ucfirst($area) . ". Espera la aprobación del encargado.",
                "prestamo"
            );
            echo json_encode(["success" => true, "message" => "Solicitud de préstamo enviada. Queda pendiente de aprobación."]);
        } else {
            echo json_encode(["success" => false, "message" => "No se pudo registrar la solicitud."]);
        }
        $stmt->close();
        $conn->close();
        exit;
    }

    // Acciones de gestión: aprobar, rechazar, devolver, marcar_vencido
    $id_aprobador = trim($input['id_aprobador'] ?? '');
    $id_prestamo = intval($input['id_prestamo'] ?? 0);
    $observaciones = trim($input['observaciones'] ?? '');

    if (!$id_aprobador || !$id_prestamo) {
        echo json_encode(["success" => false, "message" => "Datos incompletos."]);
        exit;
    }

    $rolesInfo = obtenerRolesUsuario($conn, $id_aprobador);
    $expanded = $rolesInfo['expanded'];
    if (!in_array('administrador', $expanded) && !in_array('bienestar', $expanded) && !in_array('biblioteca', $expanded)) {
        echo json_encode(["success" => false, "message" => "No tiene permisos para gestionar préstamos."]);
        exit;
    }

    $sel = $conn->prepare("SELECT id_usuario, area, elemento FROM prestamos WHERE id_prestamo = ? LIMIT 1");
    $sel->bind_param("i", $id_prestamo);
    $sel->execute();
    $prestamo = $sel->get_result()->fetch_assoc();
    $sel->close();

    if (!$prestamo) {
        echo json_encode(["success" => false, "message" => "Préstamo no encontrado."]);
        exit;
    }

    $nuevoEstado = match ($accion) {
        'aprobar' => 'activo',
        'rechazar' => 'rechazado',
        'devolver' => 'devuelto',
        'marcar_vencido' => 'vencido',
        default => ''
    };

    if (!$nuevoEstado) {
        echo json_encode(["success" => false, "message" => "Acción no válida."]);
        exit;
    }

    if ($accion === 'aprobar') {
        $horas = ($prestamo['area'] === 'biblioteca') ? 168 : 3; // 7 días libro, 3 horas deporte/PC
        $stmt = $conn->prepare("
            UPDATE prestamos
            SET estado = 'activo', id_aprobador = ?, fecha_prestamo = NOW(),
                fecha_vencimiento = DATE_ADD(NOW(), INTERVAL ? HOUR),
                observaciones = COALESCE(NULLIF(?, ''), observaciones)
            WHERE id_prestamo = ?
        ");
        $stmt->bind_param("sisi", $id_aprobador, $horas, $observaciones, $id_prestamo);
        $tituloNotif = "Préstamo Aprobado";
        $msgNotif = "Tu préstamo de '{$prestamo['elemento']}' fue aprobado. Tienes $horas horas para devolverlo.";
        $tipoNotif = "exito";
    } elseif ($accion === 'rechazar') {
        $stmt = $conn->prepare("
            UPDATE prestamos
            SET estado = 'rechazado', id_aprobador = ?,
                observaciones = COALESCE(NULLIF(?, ''), 'Solicitud rechazada por el encargado')
            WHERE id_prestamo = ?
        ");
        $stmt->bind_param("ssi", $id_aprobador, $observaciones, $id_prestamo);
        $tituloNotif = "Préstamo Rechazado";
        $msgNotif = "Tu solicitud de '{$prestamo['elemento']}' fue rechazada." . ($observaciones ? " Motivo: $observaciones" : "");
        $tipoNotif = "alerta";
    } elseif ($accion === 'devolver') {
        $stmt = $conn->prepare("
            UPDATE prestamos
            SET estado = 'devuelto', id_aprobador = ?, fecha_devolucion = NOW(),
                observaciones = COALESCE(NULLIF(?, ''), observaciones)
            WHERE id_prestamo = ?
        ");
        $stmt->bind_param("ssi", $id_aprobador, $observaciones, $id_prestamo);
        $tituloNotif = "Préstamo Devuelto";
        $msgNotif = "Se registró la devolución de '{$prestamo['elemento']}'. ¡Gracias!";
        $tipoNotif = "info";
    } else { // marcar_vencido
        $stmt = $conn->prepare("
            UPDATE prestamos
            SET estado = 'vencido', id_aprobador = ?,
                observaciones = COALESCE(NULLIF(?, ''), 'Préstamo vencido con reporte activo')
            WHERE id_prestamo = ?
        ");
        $stmt->bind_param("ssi", $id_aprobador, $observaciones, $id_prestamo);
        $tituloNotif = "Préstamo Vencido";
        $msgNotif = "Tu préstamo de '{$prestamo['elemento']}' ha sido reportado como vencido. Acércate a " . ucfirst($prestamo['area']) . ".";
        $tipoNotif = "alerta";
    }

    if ($stmt->execute()) {
        crearNotificacion($conn, $prestamo['id_usuario'], $tituloNotif, $msgNotif, $tipoNotif);
        echo json_encode(["success" => true, "message" => "Préstamo actualizado a '$nuevoEstado'."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al actualizar préstamo."]);
    }
    $stmt->close();
    $conn->close();
}
?>
