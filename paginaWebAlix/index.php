<?php
session_start();
require_once 'conexion.php';

// Si ya hay sesión iniciada, lo mandamos al carnet
if (isset($_SESSION['usuario_id'])) {
    header("Location: carnet.php");
    exit();
}

$error = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Atrapamos el documento en lugar del email
    $documento = $_POST['documento']; 
    $password = $_POST['password'];

    try {
        // 2. Buscamos al usuario por su número de documento
        $sql = "SELECT id_usuario, contrasena, nombres, documento FROM usuarios WHERE documento = :documento";
        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':documento', $documento);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // 3. Verificamos si existe y si la contraseña coincide
        if ($user && ($password == $user['contrasena'] || empty($user['contrasena']))) {
            
            // ¡Guardamos los datos! (Esto es oro para el QR)
            $_SESSION['usuario_id'] = $user['id_usuario'];
            $_SESSION['usuario_nombre'] = $user['nombres'];
            $_SESSION['usuario_documento'] = $user['documento']; 
            
            header("Location: carnet.php");
            exit();
        } else {
            $error = "Identificación o contraseña incorrectos.";
        }
    } catch(PDOException $e) {
        $error = "Error en el sistema: " . $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Sistema de Carnet Digital de la Universidad Libre. Plataforma segura para gestionar y validar credenciales digitales de estudiantes y egresados no graduados.">
    <meta name="keywords" content="carnet digital, credencial, universidad libre, estudiante, egresado no graduado">
    <meta name="author" content="Universidad Libre">
    <meta name="DC.title" content="Carnet Digital - Universidad Libre">
    <meta name="DC.creator" content="Universidad Libre">
    <meta name="DC.subject" content="carnet digital, credenciales, sistema de autenticacion">
    <meta name="DC.description" content="Sistema de Carnet Digital para la gestion de credenciales de estudiantes y egresados no graduados de la Universidad Libre.">
    <meta name="DC.publisher" content="Universidad Libre">
    <meta name="DC.date" content="2026-03-20">
    <meta name="DC.type" content="Text">
    <meta name="DC.format" content="text/html">
    <title>Login - Carnet Digital</title>
    
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/footer.css">
    <link rel="stylesheet" href="css/ui.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>

<body>

    <header class="header">
        <img src="IMG/escudo.png" alt="Escudo Unilibre" class="escudo" style="width: 70px;">
        <h1 style="color: white; margin: 0;">Universidad Libre</h1>
        <p style="color: #ff4d4d; margin: 5px 0 0; font-weight: bold;">Seccional Cucuta</p>
        <h2 style="color: white; margin-top: 20px; text-align: center;">Login</h2>
    </header>

<<div class="contenedor">
    <div class="login">
        <!-- Agregamos method="POST" para enviar los datos de forma oculta y segura -->
        <form id="login-form" method="POST" action="">

            <!-- Aquí aparecerá el error si se equivocan de clave -->
            <?php if(!empty($error)): ?>
                <p style="color: red; text-align: center; font-weight: bold; margin-bottom: 15px;"><?php echo $error; ?></p>
            <?php endif; ?>

            <label>Identificacion</label>
            <!-- Agregamos name="documento" (y required para que no lo manden vacío) -->
            <input type="text" id="login-id" name="documento" placeholder="Ingrese su ID de 10 numeros" inputmode="numeric" maxlength="10" pattern="[0-9]{10}" required>

            <label>Contraseña</label>
            <!-- Agregamos name="password" -->
            <input type="password" id="login-password" name="password" placeholder="Ingrese su contraseña" required>

            <button type="submit">Iniciar Sesion</button>
        </form>

        <a href="olvidaste-contrasena.php">Olvidaste tu contraseña?</a>

        <hr>

        <h3>Accesos rapidos</h3>

        <div class="accesos">
            <div class="card">
                <a href="visitantes.php" style="text-decoration: none; color: inherit;">
                    <h4>Visitantes</h4>
                    <p>Ver informacion del sistema</p>
                </a>
            </div>

            <div class="card">
                <a href="egresados.php" style="text-decoration: none; color: inherit;">
                    <h4>Egresados no graduados</h4>
                    <p>Renovacion / Solicitud</p>
                </a>
            </div>

            <div class="card">
                <a href="carnet.php" style="text-decoration: none; color: inherit;">
                    <h4>Ver Carnet</h4>
                    <p>Acceder a tu carnet digital</p>
                </a>
            </div>
        </div>

        <br>
        <a href="preregistro.php">Sin cuenta? Realiza tu pre-registro</a>
        <br><br>
        <a href="cambiar-contrasena.php">Cambiar contraseña</a>
        <br><br>
        <a href="admin/login.php">Panel de Administracion</a>
    </div>
</div>

<footer class="footer">
    <div class="footer-content">
        <div class="footer-section">
            <h4>Contacto</h4>
            <p><i class="fas fa-phone"></i> PBX: (607) 582 9810</p>
            <p><i class="fas fa-envelope"></i> info.cucuta@unilibre.edu.co</p>
            <p><i class="fas fa-map-marker-alt"></i> Av. 4ta n.o 12n-81 - El Bosque</p>
        </div>

        <div class="footer-section">
            <h4>Enlaces Rapidos</h4>
            <a href="index.php">Inicio</a>
            <a href="https://www.unilibre.edu.co/biblioteca" target="_blank">Biblioteca</a>
            <a href="https://www.unilibre.edu.co/cucuta/" target="_blank">Seccional Cucuta</a>
            <a href="https://www.kawak.com.co/unilibre/pqrs/pqrs_index.php" target="_blank">PQRS - Soporte Tecnico</a>
        </div>

        <div class="footer-section">
            <h4>Siguenos</h4>
            <div class="social-icons">
                <a href="https://www.facebook.com/UnilibreCucuta" target="_blank" class="icon-fb"><i class="fab fa-facebook"></i></a>
                <a href="https://www.instagram.com/unilibrecucuta" target="_blank" class="icon-ig"><i class="fab fa-instagram"></i></a>
                <a href="https://x.com/unilibrecucuta1" target="_blank" class="icon-x"><i class="fab fa-x-twitter"></i></a>
            </div>
            <p>© 2026 Universidad Libre. Todos los derechos reservados.</p>
            <p><strong>Desarrollado por:</strong><br>Juan Ruiz | Cristian Torres | Alejandro Urbina</p>
        </div>

        <div class="footer-section">
            <h4>Ubicacion</h4>
            <div class="map-container">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3257.1771286957737!2d-72.5013971260146!3d7.91221970547162!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e664540a6ea196f%3A0xb1d0e71aebd40351!2sUniversidad%20Libre%20Seccional%20C%C3%BAcuta!5e1!3m2!1ses-419!2sco!4v1773159309972!5m2!1ses-419!2sco"
                    width="100%" height="150" style="border:0;" allowfullscreen="" loading="lazy">
                </iframe>
            </div>
        </div>
    </div>
</footer>

<!--<script src="js/config.js"></script>
<script src="js/ui.js"></script>
<script src="js/auth.js"></script>
<script src="js/navigation.js"></script>
<script src="js/quickAccess.js"></script>-->

</body>
</html>
