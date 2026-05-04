<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperar Contrasena - Carnet Digital</title>

    <link rel="stylesheet" href="css/forms.css">
    <link rel="stylesheet" href="css/footer.css">
    <link rel="stylesheet" href="css/ui.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>

<body>
    <header class="header">
        <img src="IMG/escudo.png" alt="Escudo Unilibre" class="escudo" style="width: 70px;">
        <h1 style="color: white; margin: 0;">Universidad Libre</h1>
        <p style="color: #ff4d4d; margin: 5px 0 0; font-weight: bold;">Seccional Cucuta</p>
        <h2 style="color: white; margin-top: 20px; text-align: center;">Olvidaste tu contraseña?</h2>
    </header>

    <div class="contenedor">
        <div class="login">
            <p style="color: #666; font-size: 14px; line-height: 1.5;">
                Ingresa tu correo electronico y te enviaremos una contraseña temporal para recuperar el acceso.
            </p>

            <form id="recovery-form">
                <label for="recovery-email">Correo electronico</label>
                <input
                    type="email"
                    id="recovery-email"
                    placeholder="ejemplo@unilibre.edu.co"
                    required
                >

                <button type="submit">Enviar contraseña temporal</button>
            </form>

            <p id="recovery-message" style="display: none; margin-top: 15px; font-size: 14px; line-height: 1.5;"></p>

            <a href="cambiar-contrasena.php" style="font-weight: bold;">
                <i class="fas fa-key"></i> Ir a cambiar contraseña
            </a>

            <a href="index.php" style="font-weight: bold;">
                <i class="fas fa-arrow-left"></i> Volver al inicio de sesion
            </a>
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

    <script src="js/ui.js"></script>
    <script src="js/recuperacion.js"></script>
</body>
</html>
