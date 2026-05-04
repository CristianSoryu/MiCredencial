<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Estado de Carnets - Universidad Libre</title>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="../css/styles.css"> 
    <link rel="stylesheet" href="../css/footer.css">
    <link rel="stylesheet" href="../css/admin.css">
    <style>
        .badge {
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            color: white;
            display: inline-block;
            text-align: center;
            min-width: 60px;
        }
        .badge-activo {
            background-color: #28a745;
        }
        .badge-inactivo {
            background-color: #dc3545;
        }
        .btn-activar {
            background-color: #28a745;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            transition: background 0.3s;
        }
        .btn-activar:hover {
            background-color: #218838;
        }
        .btn-desactivar {
            background-color: #dc3545;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            transition: background 0.3s;
        }
        .btn-desactivar:hover {
            background-color: #c82333;
        }
        .table-carnets {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            margin-top: 20px;
        }
        .table-carnets th, .table-carnets td {
            padding: 12px;
            border-bottom: 1px solid #ddd;
        }
        .table-carnets th {
            background-color: #f8f9fa;
        }
    </style>
</head>

<body>

    <header class="header">
        <img src="../IMG/escudo.png" alt="Escudo Unilibre" class="escudo" style="width: 70px;">
        <h1 style="color: white; margin: 0;">Universidad Libre</h1>
        <p style="color: #ff4d4d; margin: 5px 0 0; font-weight: bold;">Seccional Cucuta</p>
        <h2 style="color: white; margin-top: 20px; text-align: center;">Gestionar Estado de Carnets</h2>
    </header>

    <main style="flex: 1;">
        <div class="contenedor">
            <div class="login" style="max-width: 800px; width: 100%;">

                <div style="margin-bottom: 20px; display: flex; gap: 10px;">
                    <input type="text" placeholder="Buscar por nombre o ID..." style="flex: 1; padding: 10px; border-radius: 5px; border: 1px solid #ccc;">
                    <button style="padding: 10px 20px; background-color: #e60000; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                        <i class="fas fa-search"></i> Buscar
                    </button>
                </div>

                <div style="overflow-x: auto;">
                    <table class="table-carnets">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>ID / Cedula</th>
                                <th>Estado Actual</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Carlos Ramirez</td>
                                <td>1098765432</td>
                                <td><span class="badge badge-activo">Activo</span></td>
                                <td>
                                    <button class="btn-desactivar" onclick="toggleEstado(this)"><i class="fas fa-ban"></i> Desactivar</button>
                                </td>
                            </tr>
                            <tr>
                                <td>Maria Torres</td>
                                <td>1098123456</td>
                                <td><span class="badge badge-inactivo">Inactivo</span></td>
                                <td>
                                    <button class="btn-activar" onclick="toggleEstado(this)"><i class="fas fa-check"></i> Activar</button>
                                </td>
                            </tr>
                            <tr>
                                <td>Luis Gomez</td>
                                <td>1090123456</td>
                                <td><span class="badge badge-activo">Activo</span></td>
                                <td>
                                    <button class="btn-desactivar" onclick="toggleEstado(this)"><i class="fas fa-ban"></i> Desactivar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div style="margin-top: 30px; text-align: center;">
                    <a href="admin.php" style="font-weight: bold; display: inline-block;">
                        <i class="fas fa-arrow-left"></i> Volver al panel
                    </a>
                </div>
            </div>
        </div>
    </main>

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
<script>
    function toggleEstado(btn) {
        const row = btn.closest('tr');
        const badge = row.querySelector('.badge');
        
        if (btn.classList.contains('btn-desactivar')) {
            // Cambiar a inactivo
            badge.className = 'badge badge-inactivo';
            badge.textContent = 'Inactivo';
            
            btn.className = 'btn-activar';
            btn.innerHTML = '<i class="fas fa-check"></i> Activar';
            
            // Simular petición
            // alert('Carnet desactivado correctamente.');
        } else {
            // Cambiar a activo
            badge.className = 'badge badge-activo';
            badge.textContent = 'Activo';
            
            btn.className = 'btn-desactivar';
            btn.innerHTML = '<i class="fas fa-ban"></i> Desactivar';
            
            // Simular petición
            // alert('Carnet activado correctamente.');
        }
    }
</script>
</body>
</html>
