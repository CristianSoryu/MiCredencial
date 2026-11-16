<?php
require_once '../config/db.php';
initApiHeaders("POST, OPTIONS");

$id_admin = trim($_POST['id_admin'] ?? '');
$csvText = '';

if (isset($_FILES['csvFile']) && $_FILES['csvFile']['error'] === UPLOAD_ERR_OK) {
    $csvText = file_get_contents($_FILES['csvFile']['tmp_name']);
} else {
    $input = json_decode(file_get_contents("php://input"), true);
    if ($input) {
        $id_admin = trim($input['id_admin'] ?? $id_admin);
        $csvText = $input['csv_content'] ?? '';
    }
}

if (!$id_admin) {
    echo json_encode(["success" => false, "message" => "No autorizado."]);
    exit;
}

$rolesInfo = obtenerRolesUsuario($conn, $id_admin);
if (!in_array('administrador', $rolesInfo['expanded'])) {
    echo json_encode(["success" => false, "message" => "Requiere rol de administrador."]);
    $conn->close();
    exit;
}

if (trim($csvText) === '') {
    echo json_encode(["success" => false, "message" => "El archivo o contenido CSV está vacío."]);
    exit;
}

$lines = preg_split('/\r\n|\r|\n/', trim($csvText));
$cargados = 0;
$errores = 0;
$fila = 0;

$stmt = $conn->prepare("
    INSERT INTO preregistro_oficial (tipo_documento, documento, nombres, apellidos, correo, programa_academico)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
        tipo_documento = VALUES(tipo_documento),
        nombres = VALUES(nombres),
        apellidos = VALUES(apellidos),
        correo = VALUES(correo),
        programa_academico = VALUES(programa_academico)
");

foreach ($lines as $line) {
    if (trim($line) === '') continue;
    $fila++;
    $datos = str_getcsv($line, ",");
    if ($fila === 1 && isset($datos[0]) && in_array(strtolower(trim($datos[0])), ['tipo_documento', 'tipo'])) {
        continue;
    }

    if (count($datos) >= 6) {
        $tipo = trim($datos[0]);
        $doc = trim($datos[1]);
        $nom = trim($datos[2]);
        $ape = trim($datos[3]);
        $correo = trim($datos[4]);
        $prog = trim($datos[5]);

        if (!str_ends_with(strtolower($correo), '@unilibre.edu.co') || !$doc || !$nom) {
            $errores++;
            continue;
        }

        $stmt->bind_param("ssssss", $tipo, $doc, $nom, $ape, $correo, $prog);
        if ($stmt->execute()) {
            $cargados++;
        } else {
            $errores++;
        }
    } else {
        $errores++;
    }
}

$stmt->close();
$conn->close();

echo json_encode([
    "success" => true,
    "cargados" => $cargados,
    "errores" => $errores,
    "message" => "Proceso terminado: $cargados registros cargados/actualizados, $errores omitidos."
]);
?>
