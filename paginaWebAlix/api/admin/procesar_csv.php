<?php
session_start();
header('Content-Type: application/json');

// Validar que un administrador esté logueado (puedes ajustar esta validación según tu sistema)
// if (!isset($_SESSION['admin_id'])) {
//     echo json_encode(['success' => false, 'message' => 'No autorizado']);
//     exit();
// }

require_once '../conexion.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['csvFile'])) {
    $archivo = $_FILES['csvFile'];
    
    // Validar posibles errores de subida
    if ($archivo['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(['success' => false, 'message' => 'Error al subir el archivo. Código: ' . $archivo['error']]);
        exit();
    }
    
    // Validar extensión
    $extension = strtolower(pathinfo($archivo['name'], PATHINFO_EXTENSION));
    if ($extension !== 'csv') {
        echo json_encode(['success' => false, 'message' => 'El archivo debe tener formato CSV.']);
        exit();
    }
    
    // Leer y procesar
    $handle = fopen($archivo['tmp_name'], "r");
    if ($handle !== FALSE) {
        $cargados = 0;
        $errores = 0;
        $fila = 0;
        
        // Preparar la consulta SQL con ON DUPLICATE KEY UPDATE
        // Así si el documento ya existe, actualiza los datos.
        $sql = "INSERT INTO preregistro_oficial (tipo_documento, documento, nombres, apellidos, programa_academico) 
                VALUES (:tipo, :doc, :nombres, :apellidos, :programa)
                ON DUPLICATE KEY UPDATE 
                tipo_documento = VALUES(tipo_documento),
                nombres = VALUES(nombres),
                apellidos = VALUES(apellidos),
                programa_academico = VALUES(programa_academico)";
                
        $stmt = $conexion->prepare($sql);
        
        while (($datos = fgetcsv($handle, 1000, ",")) !== FALSE) {
            $fila++;
            
            // Omitir cabecera (primera fila) si existe
            if ($fila === 1 && (strtolower(trim($datos[0])) == 'tipo_documento' || strtolower(trim($datos[0])) == 'tipo')) {
                continue;
            }
            
            // Validar que tenga las columnas mínimas (Ej: TipoDoc, Doc, Nombres, Apellidos, Programa)
            if (count($datos) >= 5) {
                try {
                    $stmt->execute([
                        ':tipo' => trim($datos[0]),
                        ':doc' => trim($datos[1]),
                        ':nombres' => trim($datos[2]),
                        ':apellidos' => trim($datos[3]),
                        ':programa' => trim($datos[4])
                    ]);
                    $cargados++;
                } catch (PDOException $e) {
                    $errores++;
                }
            } else {
                // Fila incompleta
                $errores++;
            }
        }
        fclose($handle);
        
        echo json_encode([
            'success' => true, 
            'message' => "Proceso terminado. $cargados usuarios cargados/actualizados. $errores filas con error u omitidas."
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'No se pudo leer el archivo temporal.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'No se recibió ningún archivo válido.']);
}
