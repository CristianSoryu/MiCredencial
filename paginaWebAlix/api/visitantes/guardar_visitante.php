<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../conexion.php';

// Obtener datos del cuerpo de la petición
$data = json_decode(file_get_contents("php://input"));

if(
    !empty($data->nombre_completo) &&
    !empty($data->identificacion) &&
    !empty($data->institucion) &&
    !empty($data->motivo) &&
    !empty($data->fecha_visita)
) {
    try {
        $query = "INSERT INTO solicitudes_visitantes (nombre_completo, identificacion, institucion, motivo, fecha_visita) VALUES (:nombre_completo, :identificacion, :institucion, :motivo, :fecha_visita)";
        $stmt = $conexion->prepare($query);
        
        $stmt->bindParam(':nombre_completo', $data->nombre_completo);
        $stmt->bindParam(':identificacion', $data->identificacion);
        $stmt->bindParam(':institucion', $data->institucion);
        $stmt->bindParam(':motivo', $data->motivo);
        $stmt->bindParam(':fecha_visita', $data->fecha_visita);
        
        if($stmt->execute()) {
            $id_insertado = $conexion->lastInsertId();
            http_response_code(201);
            echo json_encode(array(
                "success" => true, 
                "message" => "Solicitud de visitante registrada exitosamente.",
                "id_visitante" => $id_insertado
            ));
        } else {
            http_response_code(503);
            echo json_encode(array("success" => false, "message" => "Error al registrar la solicitud."));
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(array("success" => false, "message" => "Error de base de datos: " . $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Datos incompletos."));
}
?>
