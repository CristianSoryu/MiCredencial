<?php
date_default_timezone_set('America/Bogota');

$host = "localhost";
$usuario = "root";
$password = "";
$bd = "micredencial";
$puerto = 3306;

$conn = new mysqli($host, $usuario, $password, $bd, $puerto);

if ($conn->connect_error) {
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    die(json_encode(["success" => false, "message" => "Conexión fallida: " . $conn->connect_error]));
}

$conn->set_charset("utf8mb4");

/**
 * Inicializa cabeceras CORS y JSON para endpoints REST consumidos por Expo.
 */
function initApiHeaders(string $methods = "GET, POST, OPTIONS"): void {
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: " . $methods);
    header("Access-Control-Allow-Headers: Content-Type, Authorization");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

/**
 * Retorna los roles físicos y heredados de un usuario.
 */
function obtenerRolesUsuario(mysqli $conn, $id_usuario): array {
    $stmt = $conn->prepare("
        SELECT LOWER(TRIM(r.tipo_usuario)) AS tipo_usuario
        FROM usuario_rol ur
        JOIN roles r ON ur.id_rol = r.id_rol
        WHERE ur.id_usuario = ?
    ");
    $stmt->bind_param("s", $id_usuario);
    $stmt->execute();
    $res = $stmt->get_result();

    $raw_roles = [];
    while ($row = $res->fetch_assoc()) {
        $raw_roles[] = trim($row['tipo_usuario']);
    }
    $stmt->close();

    $roles = array_values(array_unique($raw_roles));
    $expanded = $roles;

    foreach ($roles as $rol) {
        if (in_array($rol, ['docente', 'administrativo', 'seguridad', 'administrador'])) {
            $expanded[] = 'generar carnet temporal';
        }
        if ($rol === 'administrador') {
            $expanded[] = 'escaneador';
            $expanded[] = 'escaneador de bienestar';
            $expanded[] = 'escaneador de biblioteca';
            $expanded[] = 'bienestar';
            $expanded[] = 'biblioteca';
            $expanded[] = 'admisiones_registro';
        }
        if ($rol === 'seguridad') {
            $expanded[] = 'escaneador';
        }
        if ($rol === 'bienestar') {
            $expanded[] = 'escaneador de bienestar';
        }
        if ($rol === 'biblioteca') {
            $expanded[] = 'escaneador de biblioteca';
        }
    }

    return [
        'raw' => $roles,
        'expanded' => array_values(array_unique($expanded)),
    ];
}

/**
 * Selecciona el rol principal para visualización en el carnet según prioridad.
 */
function obtenerRolPrincipal(array $rawRoles): string {
    $prioridades = [
        'administrador' => 1,
        'admisiones_registro' => 2,
        'docente' => 3,
        'administrativo' => 4,
        'seguridad' => 5,
        'bienestar' => 6,
        'biblioteca' => 7,
        'estudiante' => 8,
        'egresado' => 9,
        'egresado no graduado' => 10,
        'externo' => 11,
        'escaneador' => 100,
    ];

    $rolDisplay = 'estudiante';
    $mejor = 999;
    foreach ($rawRoles as $r) {
        $p = $prioridades[$r] ?? 50;
        if ($p < $mejor) {
            $mejor = $p;
            $rolDisplay = $r;
        }
    }
    return $rolDisplay;
}

/**
 * Inserta una notificación para un usuario específico.
 */
function crearNotificacion(mysqli $conn, $id_usuario, string $titulo, string $mensaje, string $tipo = 'info'): void {
    $stmt = $conn->prepare("
        INSERT INTO notificaciones (id_usuario, titulo, mensaje, tipo)
        VALUES (?, ?, ?, ?)
    ");
    if ($stmt) {
        $stmt->bind_param("ssss", $id_usuario, $titulo, $mensaje, $tipo);
        $stmt->execute();
        $stmt->close();
    }
}
?>
