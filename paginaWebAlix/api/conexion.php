<?php
$host = "localhost";
$usuario = "root"; // Este es el usuario por defecto en XAMPP
$contrasena = ""; // En XAMPP, la contraseña del root viene vacía por defecto
$base_de_datos = "micredencial";
try {
    // Aquí se crea el puente PDO
    $conexion = new PDO("mysql:host=$host;dbname=$base_de_datos", $usuario, $contrasena);
    
    // Le decimos a PDO que nos muestre los errores si algo falla
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
   // echo "¡Conexión exitosa a MySQL con PDO!";
    
} catch(PDOException $error) {
    // Si la conexión falla, atrapamos el error y lo mostramos en pantalla
    echo "Error de conexión: " . $error->getMessage();
}

/**
 * Obtiene todos los roles físicos e heredados/virtuales de un usuario de forma centralizada.
 *
 * @param string $id_usuario Identificación del usuario.
 * @param PDO $conexion Objeto de conexión a base de datos.
 * @return array Lista de roles en minúsculas y normalizados.
 */
function obtenerRolesUsuario($id_usuario, $conexion) {
    try {
        $sql = "SELECT LOWER(TRIM(r.tipo_usuario)) AS tipo_usuario 
                FROM usuario_rol ur 
                JOIN roles r ON ur.id_rol = r.id_rol 
                WHERE ur.id_usuario = :id";
        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':id', $id_usuario);
        $stmt->execute();
        $raw_roles = $stmt->fetchAll(PDO::FETCH_COLUMN);

        $roles = array_unique(array_map('trim', $raw_roles));
        $expanded_roles = $roles;

        // Reglas de Herencia de Roles:
        foreach ($roles as $rol) {
            // 1. Docente, Administrativo, Seguridad y Administrador heredan 'generar carnet temporal'
            if (in_array($rol, ['docente', 'administrativo', 'seguridad', 'administrador'])) {
                $expanded_roles[] = 'generar carnet temporal';
            }
            // 2. Administrador hereda todos los roles funcionales de escáner y accesos
            if ($rol === 'administrador') {
                $expanded_roles[] = 'escaneador';
                $expanded_roles[] = 'escaneador de bienestar';
                $expanded_roles[] = 'escaneador de biblioteca';
                $expanded_roles[] = 'bienestar';
                $expanded_roles[] = 'biblioteca';
            }
            // 3. Seguridad hereda el rol de escaneador (marcar entrada/salida de portería)
            if ($rol === 'seguridad') {
                $expanded_roles[] = 'escaneador';
            }
        }

        return array_values(array_unique($expanded_roles));
    } catch (PDOException $e) {
        return [];
    }
}
?>
