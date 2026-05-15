<?php
header('Content-Type: application/json');
require_once '../conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input = json_decode(file_get_contents('php://input'), true);
    if(!$input) {
        $input = $_POST;
    }

    $nombres = $input['nombres'] ?? '';
    $identificacion = $input['identificacion'] ?? '';
    $correo = $input['correo'] ?? '';
    $programa_academico = $input['programa_academico'] ?? '';

    if (empty($nombres) || empty($identificacion) || empty($correo) || empty($programa_academico)) {
        echo json_encode(['success' => false, 'message' => 'Por favor complete todos los campos.']);
        exit();
    }

    try {
        // Check if there is already a pending request for this document
        $check_sql = "SELECT id FROM solicitudes_egresados_no_graduados WHERE identificacion = :identificacion AND estado = 'pendiente'";
        $check_stmt = $conexion->prepare($check_sql);
        $check_stmt->bindParam(':identificacion', $identificacion);
        $check_stmt->execute();

        if ($check_stmt->fetch()) {
            echo json_encode(['success' => false, 'message' => 'Ya existe una solicitud en revisión para este número de identificación.']);
            exit();
        }

        // Insert new request
        $insert_sql = "INSERT INTO solicitudes_egresados_no_graduados (nombres, identificacion, correo, programa_academico, estado) 
                       VALUES (:nombres, :identificacion, :correo, :programa_academico, 'pendiente')";
        $insert_stmt = $conexion->prepare($insert_sql);
        $insert_stmt->bindParam(':nombres', $nombres);
        $insert_stmt->bindParam(':identificacion', $identificacion);
        $insert_stmt->bindParam(':correo', $correo);
        $insert_stmt->bindParam(':programa_academico', $programa_academico);

        if ($insert_stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Solicitud enviada exitosamente.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al guardar la solicitud.']);
        }

    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error en el sistema: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
}
?>
