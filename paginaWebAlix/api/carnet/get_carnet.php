<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['success' => false, 'message' => 'No autorizado', 'redirect' => 'index.html']);
    exit();
}

require_once '../conexion.php';

$id_usuario_logueado = $_SESSION['usuario_id']; 

try {
    // Obtener todos los roles del usuario
    $sql = "SELECT r.tipo_usuario 
            FROM usuario_rol ur 
            JOIN roles r ON ur.id_rol = r.id_rol 
            WHERE ur.id_usuario = :id";
    $stmt_roles = $conexion->prepare($sql);
    $stmt_roles->bindParam(':id', $id_usuario_logueado);
    $stmt_roles->execute();
    $todos_los_roles_raw = $stmt_roles->fetchAll(PDO::FETCH_ASSOC);
    
    $todos_los_roles = array_map(function($row) {
        return strtolower($row['tipo_usuario']);
    }, $todos_los_roles_raw);

    // Definir prioridades (menor nmero = mayor prioridad)
    $prioridades = [
        'administrador' => 1,
        'docente' => 2,
        'administrativo' => 3,
        'seguridad' => 4,
        'estudiante' => 5,
        'egresado' => 6,
        'egresado no graduado' => 7,
        'externo' => 8,
        'escaneador' => 100 // Rol funcional, baja prioridad de visualizacin
    ];

    // Determinar el rol a mostrar
    $rol_display = 'estudiante'; // Fallback
    if (!empty($todos_los_roles)) {
        $mejor_prioridad = 999;
        foreach ($todos_los_roles as $r) {
            $p = isset($prioridades[$r]) ? $prioridades[$r] : 50; // Roles desconocidos prioridad media
            if ($p < $mejor_prioridad) {
                $mejor_prioridad = $p;
                $rol_display = $r;
            }
        }
    }

    // Obtener datos básicos del usuario
    $sql_user = "SELECT nombres, apellidos, tipo_documento, id_usuario, foto FROM usuarios WHERE id_usuario = :id";
    $consulta = $conexion->prepare($sql_user);
    $consulta->bindParam(':id', $id_usuario_logueado);
    $consulta->execute();
    $usuario = $consulta->fetch(PDO::FETCH_ASSOC);

    if (!$usuario) {
        session_destroy();
        echo json_encode(['success' => false, 'message' => 'Usuario no encontrado', 'redirect' => 'index.html']);
        exit();
    }
    
    // Devolver los datos del usuario para pintar el carnet
    echo json_encode([
        'success' => true,
        'usuario' => [
            'nombre_completo' => strtoupper($usuario['nombres'] . ' ' . $usuario['apellidos']),
            'identificacion' => $usuario['tipo_documento'] . ' ' . $usuario['id_usuario'],
            'documento_puro' => $usuario['id_usuario'],
            'foto' => $usuario['foto'],
            'rol' => $rol_display,
            'todos_los_roles' => $todos_los_roles
        ]
    ]);
    
} catch(PDOException $error) {
    echo json_encode(['success' => false, 'message' => 'Error al cargar el carnet: ' . $error->getMessage()]);
}

