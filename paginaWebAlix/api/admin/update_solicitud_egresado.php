<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['usuario_id']) || !isset($_SESSION['is_admin'])) {
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit();
}

require_once '../conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input = json_decode(file_get_contents('php://input'), true);
    if(!$input) {
        $input = $_POST;
    }

    $id_solicitud = $input['id'] ?? '';
    $estado = $input['estado'] ?? ''; // 'aprobado' o 'rechazado'

    if (empty($id_solicitud) || empty($estado)) {
        echo json_encode(['success' => false, 'message' => 'Datos incompletos.']);
        exit();
    }

    if ($estado !== 'aprobado' && $estado !== 'rechazado') {
        echo json_encode(['success' => false, 'message' => 'Estado inválido.']);
        exit();
    }

    try {
        // Iniciar transacción
        $conexion->beginTransaction();

        $update_sql = "UPDATE solicitudes_egresados_no_graduados SET estado = :estado WHERE id = :id";
        $update_stmt = $conexion->prepare($update_sql);
        $update_stmt->bindParam(':estado', $estado);
        $update_stmt->bindParam(':id', $id_solicitud);
        $update_stmt->execute();

        if ($estado === 'aprobado') {
            // Insertar en preregistro_oficial para que pueda crear su cuenta
            $sel_sql = "SELECT nombres, identificacion, correo, programa_academico FROM solicitudes_egresados_no_graduados WHERE id = :id";
            $sel_stmt = $conexion->prepare($sel_sql);
            $sel_stmt->bindParam(':id', $id_solicitud);
            $sel_stmt->execute();
            $solicitud = $sel_stmt->fetch(PDO::FETCH_ASSOC);

            if ($solicitud) {
                // Check if already in preregistro
                $check_sql = "SELECT id FROM preregistro_oficial WHERE documento = :documento";
                $check_stmt = $conexion->prepare($check_sql);
                $check_stmt->bindParam(':documento', $solicitud['identificacion']);
                $check_stmt->execute();

                if (!$check_stmt->fetch()) {
                    $insert_sql = "INSERT INTO preregistro_oficial (tipo_documento, documento, nombres, apellidos, correo, programa_academico, fecha_carga) 
                                   VALUES ('CC', :documento, :nombres, '', :correo, :programa, NOW())";
                    $insert_stmt = $conexion->prepare($insert_sql);
                    $insert_stmt->bindParam(':documento', $solicitud['identificacion']);
                    $insert_stmt->bindParam(':nombres', $solicitud['nombres']);
                    $insert_stmt->bindParam(':correo', $solicitud['correo']);
                    $insert_stmt->bindParam(':programa', $solicitud['programa_academico']);
                    $insert_stmt->execute();
                }
            }
        }

        $conexion->commit();
        echo json_encode(['success' => true, 'message' => 'Solicitud actualizada a ' . $estado]);

    } catch(PDOException $e) {
        $conexion->rollBack();
        echo json_encode(['success' => false, 'message' => 'Error en el sistema: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
}
?>
