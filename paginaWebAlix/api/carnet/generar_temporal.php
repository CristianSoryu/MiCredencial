<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit();
}

require_once '../conexion.php';

$id_usuario_logueado = $_SESSION['usuario_id'];

try {
    // Verificar si el usuario tiene permiso para generar carnets temporales
    $roles_usuario = obtenerRolesUsuario($id_usuario_logueado, $conexion);

    if (!in_array('generar carnet temporal', $roles_usuario)) {
        echo json_encode(['success' => false, 'message' => 'No tiene permisos para generar carnets temporales.']);
        exit();
    }

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $tipo = $input['tipo'] ?? 'persona';
        $nombre = trim($input['nombre'] ?? '');
        $documento = trim($input['documento'] ?? '');
        $motivo = trim($input['motivo'] ?? '');
        $duracion = intval($input['duracion'] ?? 60); // duración en minutos

        if ($tipo !== 'persona' && $tipo !== 'grupo') {
            echo json_encode(['success' => false, 'message' => 'Tipo de visitante inválido.']);
            exit();
        }

        if (empty($nombre)) {
            echo json_encode(['success' => false, 'message' => 'El nombre es obligatorio.']);
            exit();
        }

        if ($tipo === 'persona' && empty($documento)) {
            echo json_encode(['success' => false, 'message' => 'El número de documento es obligatorio para personas individuales.']);
            exit();
        }

        if (empty($motivo)) {
            echo json_encode(['success' => false, 'message' => 'El motivo de la visita es obligatorio.']);
            exit();
        }

        // La duración mínima es 30 minutos y la máxima es 12 horas (720 minutos)
        if ($duracion < 30 || $duracion > 720) {
            echo json_encode(['success' => false, 'message' => 'La duración debe estar entre 30 minutos y 12 horas.']);
            exit();
        }

        // Obtener nombre del creador (anfitrión)
        $sql_host = "SELECT nombres, apellidos FROM usuarios WHERE id_usuario = :id";
        $stmt_host = $conexion->prepare($sql_host);
        $stmt_host->bindParam(':id', $id_usuario_logueado);
        $stmt_host->execute();
        $host = $stmt_host->fetch(PDO::FETCH_ASSOC);
        $nombre_anfitrion = $host ? ($host['nombres'] . ' ' . $host['apellidos']) : 'Personal de la Institución';

        // Generar un token único y seguro para el QR
        $token = bin2hex(random_bytes(16));
        $codigo_qr = 'TEMP_' . $token;

        $fecha_creacion = date('Y-m-d H:i:s');
        $fecha_expiracion = date('Y-m-d H:i:s', strtotime('+' . $duracion . ' minutes'));

        // Insertar en la base de datos
        $sql_insert = "INSERT INTO carnets_temporales (id_creador, tipo, nombre, documento, motivo, fecha_creacion, fecha_expiracion, codigo_qr) 
                       VALUES (:id_creador, :tipo, :nombre, :documento, :motivo, :fecha_creacion, :fecha_expiracion, :codigo_qr)";
        $stmt_insert = $conexion->prepare($sql_insert);
        $stmt_insert->bindParam(':id_creador', $id_usuario_logueado);
        $stmt_insert->bindParam(':tipo', $tipo);
        $stmt_insert->bindParam(':nombre', $nombre);
        // Guardamos NULL si es grupo
        $doc_value = ($tipo === 'persona') ? $documento : null;
        $stmt_insert->bindParam(':documento', $doc_value);
        $stmt_insert->bindParam(':motivo', $motivo);
        $stmt_insert->bindParam(':fecha_creacion', $fecha_creacion);
        $stmt_insert->bindParam(':fecha_expiracion', $fecha_expiracion);
        $stmt_insert->bindParam(':codigo_qr', $codigo_qr);
        $stmt_insert->execute();

        echo json_encode([
            'success' => true,
            'message' => 'Carnet temporal creado con éxito.',
            'carnet' => [
                'tipo' => $tipo,
                'nombre' => $nombre,
                'documento' => $tipo === 'persona' ? $documento : 'GRUPO / INSTITUCIÓN',
                'motivo' => $motivo,
                'fecha_expiracion' => date('Y-m-d h:i A', strtotime($fecha_expiracion)),
                'codigo_qr' => base64_encode($codigo_qr), // Lo pasamos en base64 para que coincida con el parser del escáner que hace base64_decode
                'anfitrion' => $nombre_anfitrion
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
    }
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error de servidor: ' . $e->getMessage()]);
}
?>
