<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cargue de Archivos CSV - Universidad Libre</title>
    
    <link rel="stylesheet" href="../css/styles.css">
    <link rel="stylesheet" href="../css/admin.css">
    <link rel="stylesheet" href="../css/footer.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <style>
        .upload-container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 500px;
            margin: 0 auto;
        }
        .upload-container h3 {
            margin-bottom: 20px;
            color: #333;
        }
        .upload-container input[type="file"] {
            margin-bottom: 20px;
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-sizing: border-box;
        }
        .upload-btn {
            background-color: #e60000;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s;
            width: 100%;
        }
        .upload-btn:hover {
            background-color: #cc0000;
        }
    </style>
</head>

<body>

    <header class="header">
        <img src="../IMG/escudo.png" alt="Escudo Unilibre" class="escudo" style="width: 70px;">
        <h1 style="color: white; margin: 0;">Universidad Libre</h1>
        <p style="color: #ff4d4d; margin: 5px 0 0; font-weight: bold;">Seccional Cucuta</p>
        <h2 style="color: white; margin-top: 20px; text-align: center;">Cargue de Archivos CSV</h2>
    </header>

    <div class="contenedor">
        <div class="login">
            <div class="upload-container">
                <h3>Subir listado (CSV)</h3>
                <form id="csvUploadForm">
                    <input type="file" id="csvFile" accept=".csv" required>
                    <button type="submit" class="upload-btn">
                        <i class="fas fa-upload"></i> Cargar Archivo
                    </button>
                </form>
                <div id="uploadResult" style="margin-top: 15px; font-weight: bold;"></div>
            </div>

            <div style="margin-top: 30px; text-align: center;">
                <a href="admin.php" style="font-weight: bold; display: inline-block;">
                    <i class="fas fa-arrow-left"></i> Volver al panel
                </a>
            </div>
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
                <a href="../index.php">Inicio</a>
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

<script src="../js/ui.js"></script>
<script src="../js/admin-auth.js"></script>
<script>
    requireAdminAuth();
</script>
<script src="../js/quickAccess.js"></script>
<script>
    document.getElementById('csvUploadForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const fileInput = document.getElementById('csvFile');
        const resultDiv = document.getElementById('uploadResult');
        
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            // Simulación de cargue
            resultDiv.style.color = 'green';
            resultDiv.innerHTML = '<i class="fas fa-check-circle"></i> Archivo "' + file.name + '" cargado correctamente.';
            fileInput.value = ''; // Limpiar el input
        } else {
            resultDiv.style.color = 'red';
            resultDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> Por favor selecciona un archivo CSV.';
        }
    });
</script>
</body>
</html>
