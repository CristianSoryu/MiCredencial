<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit();
}

require_once '../conexion.php';

// Verificar que el usuario que intenta escanear sea un ESCANEADOR (Seguridad, Bienestar o Biblioteca)
try {
    $sql_check = "SELECT r.tipo_usuario 
                  FROM usuario_rol ur 
                  JOIN roles r ON ur.id_rol = r.id_rol 
                  WHERE ur.id_usuario = :id AND r.tipo_usuario IN ('escaneador', 'escaneador de bienestar', 'bienestar', 'escaneador de biblioteca', 'biblioteca')";
    $stmt_check = $conexion->prepare($sql_check);
    $stmt_check->bindParam(':id', $_SESSION['usuario_id']);
    $stmt_check->execute();
    $tiene_permiso = $stmt_check->fetch();

    if (!$tiene_permiso) {
        echo json_encode(['success' => false, 'message' => 'No tiene permisos para realizar escaneos.']);
        exit();
    }
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error de seguridad: ' . $e->getMessage()]);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input = json_decode(file_get_contents('php://input'), true);
    $qr_data = $input['qr_data'] ?? '';

    if (empty($qr_data)) {
        echo json_encode(['success' => false, 'message' => 'Datos QR vacíos.']);
        exit();
    }

    // El QR viene en Base64 con el formato "documento_fechaISO"
    $decoded = base64_decode($qr_data, true);
    
    if ($decoded === false) {
        echo json_encode(['success' => false, 'message' => 'Formato de QR inválido.']);
        exit();
    }

    $parts = explode('_', $decoded);
    if (count($parts) < 2) {
        echo json_encode(['success' => false, 'message' => 'Estructura de QR inválida.']);
        exit();
    }

    if ($parts[0] === 'TEMP') {
        // Es un carnet temporal
        $token = $decoded; // El token completo es "TEMP_random_hex"
        try {
            $sql_temp = "SELECT ct.*, u.nombres AS host_nombres, u.apellidos AS host_apellidos 
                         FROM carnets_temporales ct 
                         JOIN usuarios u ON ct.id_creador = u.id_usuario 
                         WHERE ct.codigo_qr = :token";
            $stmt_temp = $conexion->prepare($sql_temp);
            $stmt_temp->bindParam(':token', $token);
            $stmt_temp->execute();
            $carnet_temp = $stmt_temp->fetch(PDO::FETCH_ASSOC);

            if (!$carnet_temp) {
                echo json_encode(['success' => false, 'message' => 'Carnet temporal no encontrado o inválido.']);
                exit();
            }

            // Validar expiración
            $expiracion = strtotime($carnet_temp['fecha_expiracion']);
            if (time() > $expiracion) {
                echo json_encode(['success' => false, 'message' => 'El carnet temporal ha expirado el ' . date('d/m/Y h:i A', $expiracion) . '.']);
                exit();
            }

            // Retornar información del carnet temporal
            echo json_encode([
                'success' => true,
                'usuario' => [
                    'es_temporal' => true,
                    'id_usuario' => 'TEMP_' . $carnet_temp['id_temporal'],
                    'nombre_completo' => strtoupper($carnet_temp['nombre']),
                    'identificacion' => ($carnet_temp['tipo'] === 'persona') ? ('CC ' . $carnet_temp['documento']) : 'GRUPO / INSTITUCIÓN',
                    'documento_puro' => ($carnet_temp['tipo'] === 'persona') ? $carnet_temp['documento'] : 'GRUPO',
                    'foto' => null,
                    'rol' => 'visitante temporal',
                    'tipo_temporal' => $carnet_temp['tipo'],
                    'motivo' => $carnet_temp['motivo'],
                    'anfitrion' => strtoupper($carnet_temp['host_nombres'] . ' ' . $carnet_temp['host_apellidos']),
                    'fecha_expiracion' => date('Y-m-d h:i A', $expiracion)
                ]
            ]);
            exit();
        } catch(PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Error en base de datos al validar QR temporal: ' . $e->getMessage()]);
            exit();
        }
    }

    $id_usuario = $parts[0];
    $qr_fecha_str = $parts[1]; // e.g., "2026-05-18T19:29" (UTC time from JS toISOString)
    $qr_time = strtotime($qr_fecha_str . 'Z');
    $server_time = time(); // Unix timestamp is always UTC
    
    if (!$qr_time) {
        echo json_encode(['success' => false, 'message' => 'Fecha de QR inválida.']);
        exit();
    }

    $time_diff = abs($server_time - $qr_time);
    
    if ($time_diff > 120) {
        echo json_encode(['success' => false, 'message' => 'Código QR expirado o inválido. Por favor, pida al usuario que recargue su carnet.']);
        exit();
    }

    try {
        $sql = "SELECT u.nombres, u.apellidos, u.tipo_documento, u.id_usuario, u.foto, r.tipo_usuario 
                FROM usuarios u 
                LEFT JOIN usuario_rol ur ON u.id_usuario = ur.id_usuario 
                LEFT JOIN roles r ON ur.id_rol = r.id_rol 
                WHERE u.id_usuario = :id";
        
        $consulta = $conexion->prepare($sql);
        $consulta->bindParam(':id', $id_usuario);
        $consulta->execute();
        
        $usuario = $consulta->fetch(PDO::FETCH_ASSOC);

        if ($usuario) {
            // Obtener programa académico real de preregistro_oficial o egresados
            $prog_sql = "SELECT programa_academico FROM preregistro_oficial WHERE documento = :id 
                         UNION 
                         SELECT programa_academico FROM solicitudes_egresados_no_graduados WHERE identificacion = :id AND estado = 'aprobado'
                         LIMIT 1";
            $prog_stmt = $conexion->prepare($prog_sql);
            $prog_stmt->bindParam(':id', $id_usuario);
            $prog_stmt->execute();
            $prog_row = $prog_stmt->fetch(PDO::FETCH_ASSOC);
            $programa = $prog_row ? $prog_row['programa_academico'] : 'Ingeniería en Tecnologías de la Información y Comunicación';

            // Simulación de base de datos de préstamos de Bienestar Universitario
            $prestamos_mock = [
                '1092520000' => [
                    'tiene_prestamo' => true,
                    'elemento' => 'Balón de fútbol',
                    'estado' => 'activo',
                    'fecha_prestamo' => date('Y-m-d h:i A', strtotime('-2 hours')),
                    'fecha_vencimiento' => date('Y-m-d h:i A', strtotime('+1 hours')),
                    'reporte' => null
                ],
                '1110123123' => [
                    'tiene_prestamo' => true,
                    'elemento' => 'Raquetas de tennis',
                    'estado' => 'vencido',
                    'fecha_prestamo' => date('Y-m-d h:i A', strtotime('-3 days')),
                    'fecha_vencimiento' => date('Y-m-d h:i A', strtotime('-2 days')),
                    'reporte' => 'El préstamo está vencido. Tiene un reporte por entrega tardía y una sanción activa de 7 días sin préstamos.'
                ]
            ];

            $prestamo_info = isset($prestamos_mock[$id_usuario]) ? $prestamos_mock[$id_usuario] : [
                'tiene_prestamo' => false,
                'elemento' => null,
                'estado' => 'ninguno',
                'fecha_prestamo' => null,
                'fecha_vencimiento' => null,
                'reporte' => null
            ];

            // Simulación de base de datos de préstamos de Biblioteca
            $prestamos_biblioteca_mock = [
                '1092520000' => [
                    'tiene_prestamo' => true,
                    'libro' => 'Cien años de soledad - Gabriel García Márquez',
                    'estado' => 'activo',
                    'fecha_prestamo' => date('Y-m-d h:i A', strtotime('-4 hours')),
                    'fecha_vencimiento' => date('Y-m-d h:i A', strtotime('+7 days')),
                    'reporte' => null
                ],
                '1110123123' => [
                    'tiene_prestamo' => true,
                    'libro' => 'Don Quijote de la Mancha - Miguel de Cervantes',
                    'estado' => 'vencido',
                    'fecha_prestamo' => date('Y-m-d h:i A', strtotime('-15 days')),
                    'fecha_vencimiento' => date('Y-m-d h:i A', strtotime('-8 days')),
                    'reporte' => 'El préstamo del libro está vencido por 8 días. Reporte activo por mal estado (portada rayada y hojas sueltas). Multa acumulada de $8,500 COP.'
                ]
            ];

            $prestamo_biblioteca_info = isset($prestamos_biblioteca_mock[$id_usuario]) ? $prestamos_biblioteca_mock[$id_usuario] : [
                'tiene_prestamo' => false,
                'libro' => null,
                'estado' => 'ninguno',
                'fecha_prestamo' => null,
                'fecha_vencimiento' => null,
                'reporte' => null
            ];

            echo json_encode([
                'success' => true,
                'usuario' => [
                    'id_usuario' => $usuario['id_usuario'],
                    'nombre_completo' => strtoupper($usuario['nombres'] . ' ' . $usuario['apellidos']),
                    'identificacion' => $usuario['tipo_documento'] . ' ' . $usuario['id_usuario'],
                    'documento_puro' => $usuario['id_usuario'],
                    'foto' => $usuario['foto'],
                    'rol' => $usuario['tipo_usuario'] ?? 'estudiante',
                    'programa' => $programa,
                    'prestamo' => $prestamo_info,
                    'prestamo_biblioteca' => $prestamo_biblioteca_info
                ]
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Usuario no encontrado en el sistema.']);
        }
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error en la base de datos: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}

