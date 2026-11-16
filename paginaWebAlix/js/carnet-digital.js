let documentoEstudiante = "";
let intervalId = null;

document.addEventListener("DOMContentLoaded", () => {
    fetch('../api/carnet/get_carnet.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('cargando-datos').style.display = 'none';
                document.getElementById('datos-carnet').style.display = 'block';
                
                const nombreEl = document.getElementById('carnet-nombre');
                if (nombreEl) nombreEl.textContent = data.usuario.nombre_completo;

                const idEl = document.getElementById('carnet-id');
                if (idEl) idEl.textContent = data.usuario.identificacion;

                const progEl = document.getElementById('carnet-programa');
                const labelEl = document.getElementById('label-programa-cargo');
                if (progEl && data.usuario.programa) {
                    progEl.textContent = data.usuario.programa;
                    if (data.usuario.programa.startsWith('Docente') || data.usuario.programa === 'Administrativo') {
                        if (labelEl) labelEl.textContent = 'CARGO:';
                    } else {
                        if (labelEl) labelEl.textContent = 'PROGRAMA:';
                    }
                }

                
                const rol = data.usuario.rol ? data.usuario.rol.toLowerCase().trim() : 'estudiante';
                const badge = document.getElementById('badge-rol');
                if (badge) {
                    badge.textContent = rol.toUpperCase();
                }

                const carnetDiv = document.getElementById('datos-carnet');
                if (carnetDiv) {
                    carnetDiv.classList.remove('carnet-docente', 'carnet-administrativo', 'carnet-administrador');
                    
                    if (rol === 'administrador') {
                        carnetDiv.classList.add('carnet-administrador');
                    } else if (rol === 'docente') {
                        carnetDiv.classList.add('carnet-docente');
                    } else if (['administrativo', 'bienestar', 'seguridad', 'egresado', 'egresado no graduado', 'externo'].includes(rol)) {
                        carnetDiv.classList.add('carnet-administrativo');
                    }
                }

                // Mostrar botón de escáner si el usuario tiene el rol de escaneador o administrador entre sus roles
                const todosLosRoles = data.usuario.todos_los_roles || [];
                if (todosLosRoles.includes('escaneador') || todosLosRoles.includes('administrador') || rol === 'administrador') {
                    const scannerBtn = document.getElementById('scanner-action-container');
                    if (scannerBtn) {
                        scannerBtn.style.display = 'block';
                    }
                    const historialBtn = document.getElementById('historial-action-container');
                    if (historialBtn) {
                        historialBtn.style.display = 'block';
                    }
                }
                
                // Mostrar botón de solicitudes de egresados NG para admisiones o admin
                if (todosLosRoles.includes('admisiones_registro') || todosLosRoles.includes('administrador')) {
                    const solicitudesEgresadosBtn = document.getElementById('card-solicitudes-egresados');
                    if (solicitudesEgresadosBtn) {
                        solicitudesEgresadosBtn.style.display = 'block';
                    }
                }

                // Mostrar botón de generar carnet temporal si el usuario tiene la capacidad/rol de generar carnet temporal
                if (todosLosRoles.includes('generar carnet temporal') || todosLosRoles.some(r => r.toLowerCase() === 'generar carnet temporal')) {
                    const btnContainer = document.getElementById('btn-generar-temp-container');
                    if (btnContainer) {
                        btnContainer.style.display = 'block';
                    }
                }
                
                if (data.usuario.foto) {
                    document.getElementById('foto-perfil').src = data.usuario.foto;
                } else {
                    document.getElementById('foto-perfil').src = '../IMG/escudo.png'; // Fallback
                    showToast('¡Atención! Debes cargar una foto para tu carnet virtual.', 'info');
                }
                
                documentoEstudiante = data.usuario.documento_puro;
                actualizarQR();
                intervalId = setInterval(actualizarQR, 60000);
            } else {
                const is_admin_folder = window.location.pathname.includes('/admin/');
                window.location.href = is_admin_folder ? '../html/index.html' : 'index.html';
            }
        })
        .catch(error => {
            console.error("Error al cargar datos:", error);
            document.getElementById('cargando-datos').textContent = 'Error al cargar los datos. Intente recargar la página.';
        });

    const fotoInput = document.getElementById('foto-input');
    const cambiarFotoBtn = document.getElementById('cambiar-foto-btn');

    if (cambiarFotoBtn && fotoInput) {
        cambiarFotoBtn.addEventListener('click', () => {
            fotoInput.click();
        });

        fotoInput.addEventListener('change', (event) => {
            const archivo = event.target.files && event.target.files[0];
            if (!archivo) return;

            if (!archivo.type.startsWith('image/')) {
                showToast('Selecciona un archivo de imagen válido.', 'error');
                event.target.value = '';
                return;
            }

            const lector = new FileReader();
            lector.onload = () => {
                const fotoBase64 = lector.result;
                document.getElementById('foto-perfil').src = fotoBase64;
                
                fetch('../api/carnet/upload_foto.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ foto: fotoBase64 })
                })
                .then(res => res.json())
                .then(resData => {
                    if(!resData.success) {
                        showToast('Error al guardar la foto en el servidor: ' + resData.message, 'error');
                    } else {
                        showToast('¡Foto de perfil actualizada correctamente!', 'success');
                    }
                })
                .catch(err => {
                    console.error('Error subiendo foto:', err);
                    showToast('Hubo un error de conexión al subir la foto.', 'error');
                });
            };
            lector.readAsDataURL(archivo);
        });
    }
    inicializarDatalistInstituciones();
    inicializarDatalistMotivos();
});

function actualizarQR() {
    if (!documentoEstudiante) return;
    
    document.getElementById("qrcode").innerHTML = "";
    
    const fechaActual = new Date().toISOString().slice(0, 16); 
    const contenidoQR = btoa(documentoEstudiante + "_" + fechaActual);

    new QRCode(document.getElementById("qrcode"), {
        text: contenidoQR,
        width: 150,
        height: 150,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
    console.log("QR Actualizado: " + fechaActual);
}


function logout() {
    fetch('../api/auth/logout.php', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            window.location.href = 'index.html';
        })
        .catch(error => {
            console.error("Error al cerrar sesión", error);
            window.location.href = 'index.html';
        });
}

// ==================== CARNET TEMPORAL FUNCTIONS ====================

function abrirModalTemporal() {
    // Reset form view
    document.getElementById('temp-form-view').style.display = 'block';
    document.getElementById('temp-ticket-view').style.display = 'none';
    document.getElementById('temp-creation-form').reset();
    
    // Default form configuration
    document.getElementById('temp-tipo').value = 'persona';
    toggleTipoVisitante();
    
    // Populate durations (30 min - 12 hours)
    const selectDur = document.getElementById('temp-duracion');
    selectDur.innerHTML = '';
    for (let minutos = 30; minutos <= 720; minutos += 30) {
        const opt = document.createElement('option');
        opt.value = minutos;
        let lbl = '';
        if (minutos < 60) {
            lbl = `${minutos} minutos`;
        } else {
            const horas = minutos / 60;
            if (horas === 1) {
                lbl = `1 hora`;
            } else if (horas % 1 === 0) {
                lbl = `${horas} horas`;
            } else {
                lbl = `${Math.floor(horas)} horas y 30 minutos`;
            }
        }
        opt.textContent = lbl;
        selectDur.appendChild(opt);
    }
    
    // Show modal
    document.getElementById('temp-carnet-modal').classList.add('show');
}

function cerrarModalTemporal() {
    document.getElementById('temp-carnet-modal').classList.remove('show');
}

function toggleTipoVisitante() {
    const tipo = document.getElementById('temp-tipo').value;
    const lblNombre = document.getElementById('lbl-temp-nombre');
    const groupDoc = document.getElementById('group-documento');
    const inputNombre = document.getElementById('temp-nombre');
    const inputDoc = document.getElementById('temp-documento');
    const inputMotivo = document.getElementById('temp-motivo');
    
    if (tipo === 'grupo') {
        lblNombre.textContent = "Nombre del Grupo / Delegación";
        inputNombre.placeholder = "Seleccione o escriba la institución...";
        inputNombre.setAttribute('list', 'instituciones-list');
        groupDoc.style.display = 'none';
        inputDoc.required = false;
        inputDoc.value = '';
        
        if (inputMotivo) {
            inputMotivo.placeholder = "Seleccione o escriba el motivo...";
            inputMotivo.setAttribute('list', 'motivos-grupo-list');
        }
    } else {
        lblNombre.textContent = "Nombre del Visitante";
        inputNombre.placeholder = "Ej. Juan Pérez";
        inputNombre.removeAttribute('list');
        groupDoc.style.display = 'block';
        inputDoc.required = true;
        
        if (inputMotivo) {
            inputMotivo.placeholder = "Seleccione o escriba el motivo...";
            inputMotivo.setAttribute('list', 'motivos-persona-list');
        }
    }
}

function inicializarDatalistMotivos() {
    if (document.getElementById('motivos-persona-list')) return;

    const datalistPersona = document.createElement('datalist');
    datalistPersona.id = 'motivos-persona-list';
    const motivosPersona = [
        "Consultorio Jurídico y Conciliación",
        "Admisiones y matrículas",
        "Trámites administrativos y registro",
        "Recorrido por el campus",
        "Eventos, congresos y talleres",
        "Entrevistas de selección",
        "Uso de biblioteca y áreas comunes",
        "Egreso y fidelización"
    ];
    motivosPersona.forEach(motivo => {
        const option = document.createElement('option');
        option.value = motivo;
        datalistPersona.appendChild(option);
    });
    document.body.appendChild(datalistPersona);

    const datalistGrupo = document.createElement('datalist');
    datalistGrupo.id = 'motivos-grupo-list';
    const motivosGrupo = [
        "Orientación vocacional",
        "Alianzas, convenios y articulación",
        "Encuentros deportivos y culturales",
        "Visitas técnicas y prácticas académicas",
        "Proyectos de proyección social y extensión",
        "Eventos académicos y ferias de ciencia",
        "Capacitación y reuniones docentes"
    ];
    motivosGrupo.forEach(motivo => {
        const option = document.createElement('option');
        option.value = motivo;
        datalistGrupo.appendChild(option);
    });
    document.body.appendChild(datalistGrupo);
}

function inicializarDatalistInstituciones() {
    if (document.getElementById('instituciones-list')) return;

    const datalist = document.createElement('datalist');
    datalist.id = 'instituciones-list';

    const instituciones = [
        // Universidades
        "Universidad Libre (Seccional Cúcuta)",
        "Universidad Francisco de Paula Santander (UFPS - Cúcuta)",
        "Universidad de Pamplona (Unipamplona - Sede Villa del Rosario)",
        "Universidad de Santander (UDES - Cúcuta)",
        "Universidad Simón Bolívar (Sede Cúcuta)",
        "FESC (Fundación de Estudios Superiores Comfanorte)",
        "SENA (Servicio Nacional de Aprendizaje - Cúcuta)",
        "Corporación Universitaria Minuto de Dios (Uniminuto - Cúcuta)",
        "Corporación Universitaria Remington (Cúcuta)",
        "Universidad Antonio Nariño (UAN - Cúcuta)",
        "UNAD (Universidad Nacional Abierta y a Distancia - Cúcuta/Los Patios)",
        // Colegios
        "Colegio Calasanz (Cúcuta)",
        "Colegio Sagrado Corazón de Jesús (Cúcuta)",
        "Colegio Santo Ángel de la Guarda (Cúcuta)",
        "Colegio Carmen Teresiano (Cúcuta)",
        "Colegio INEM José Eusebio Caro (Cúcuta)",
        "Colegio Municipal Gremios Unidos (Cúcuta)",
        "Institución Educativa Colegio de Sugamuxi (Cúcuta)",
        "Colegio Provincial San José (Cúcuta)",
        "Colegio Salesiano Instituto San Tarsicio (Cúcuta)",
        "Colegio Padre Manuel Briceño Jáuregui - Fe y Alegría (Cúcuta)",
        "Colegio Mercedes Ábrego (Cúcuta)",
        "Gimnasio Domingo Savio (Cúcuta)",
        "Institución Educativa Colegio General Santander (Villa del Rosario)",
        "Colegio Manuel Antonio Rueda Jara (Villa del Rosario)",
        "Colegio Integrado Crecer y Crear (Villa del Rosario)",
        "Institución Educativa San Antonio (Villa del Rosario)",
        "Colegio María Inmaculada (Villa del Rosario)",
        "Colegio Técnico Municipal de Los Patios",
        "Institución Educativa Fe y Alegría (Los Patios)",
        "Colegio Once de Noviembre (Los Patios)",
        "Colegio Instituto Técnico Municipal Patios Centro",
        "Colegio Sinaí (Los Patios)",
        "Colegio Cooperativo San José de Peralta (Los Patios)"
    ];

    instituciones.forEach(inst => {
        const option = document.createElement('option');
        option.value = inst;
        datalist.appendChild(option);
    });

    document.body.appendChild(datalist);
}

function volverAlFormulario() {
    document.getElementById('temp-form-view').style.display = 'block';
    document.getElementById('temp-ticket-view').style.display = 'none';
}

function procesarGenerarTemporal(event) {
    event.preventDefault();
    
    const tipo = document.getElementById('temp-tipo').value;
    const nombre = document.getElementById('temp-nombre').value;
    const documento = document.getElementById('temp-documento').value;
    const motivo = document.getElementById('temp-motivo').value;
    const duracion = document.getElementById('temp-duracion').value;
    
    const payload = {
        tipo: tipo,
        nombre: nombre,
        documento: tipo === 'grupo' ? 'N/A' : documento,
        motivo: motivo,
        duracion: parseInt(duracion)
    };
    
    fetch('../api/carnet/generar_temporal.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showToast('¡Pase temporal generado correctamente!', 'success');
            mostrarTicketTemporal(data.carnet);
        } else {
            showToast('Error: ' + data.message, 'error');
        }
    })
    .catch(err => {
        console.error('Error al generar carnet temporal:', err);
        showToast('Ocurrió un error al generar el carnet temporal.', 'error');
    });
}

function mostrarTicketTemporal(carnet) {
    document.getElementById('temp-form-view').style.display = 'none';
    document.getElementById('temp-ticket-view').style.display = 'block';
    
    // Fill ticket text fields
    document.getElementById('ticket-visitor').textContent = carnet.nombre.toUpperCase();
    
    const docRow = document.getElementById('ticket-doc-row');
    if (carnet.tipo === 'grupo') {
        docRow.style.display = 'none';
    } else {
        docRow.style.display = 'block';
        document.getElementById('ticket-doc').textContent = carnet.documento;
    }
    
    document.getElementById('ticket-reason').textContent = carnet.motivo;
    document.getElementById('ticket-expires').textContent = carnet.fecha_expiracion;
    document.getElementById('ticket-host').textContent = carnet.anfitrion.toUpperCase();
    
    // Generate QR code inside the ticket container
    const qrContainer = document.getElementById('temp-qrcode');
    qrContainer.innerHTML = '';
    
    // Supply the base64-encoded QR string directly as text!
    new QRCode(qrContainer, {
        text: carnet.codigo_qr,
        width: 220,
        height: 220,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
}

async function exportarTicketPNG() {
    const nombre = document.getElementById('ticket-visitor').textContent;
    const doc = document.getElementById('ticket-doc').textContent;
    const motivo = document.getElementById('ticket-reason').textContent;
    const expira = document.getElementById('ticket-expires').textContent;
    const anfitrion = document.getElementById('ticket-host').textContent;
    const tipo = document.getElementById('temp-tipo').value;
    
    // Get QR image source from rendering
    const qrCanvas = document.querySelector('#temp-qrcode canvas');
    const qrImgSrc = qrCanvas ? qrCanvas.toDataURL('image/png') : '';
    
    // Initialize standard high definition Canvas
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 680;
    const ctx = canvas.getContext('2d');
    
    // Load images asynchronously
    const loadImage = (src) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = src;
        });
    };
    
    const logo = await loadImage('../IMG/escudo.png');
    const qrImg = qrImgSrc ? await loadImage(qrImgSrc) : null;
    
    // 1. Draw premium background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 680);
    grad.addColorStop(0, '#1e293b');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 400, 680);
    
    // 2. Draw gold accent borders
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, 380, 660);
    
    // 3. Draw Header
    if (logo) {
        ctx.drawImage(logo, 200 - 30, 30, 60, 60);
    }
    
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 18px "Outfit", "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('UNIVERSIDAD LIBRE', 200, 115);
    
    ctx.fillStyle = '#eab308';
    ctx.font = 'bold 12px "Outfit", "Inter", sans-serif';
    ctx.fillText('SECCIONAL CÚCUTA', 200, 135);
    
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 10px "Outfit", "Inter", sans-serif';
    ctx.fillText('CONTROL DE ACCESO DIGITAL', 200, 155);
    
    // 4. Draw QR Background Card
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    if (ctx.roundRect) {
        ctx.roundRect(200 - 110, 175, 220, 220, 12);
    } else {
        ctx.rect(200 - 110, 175, 220, 220);
    }
    ctx.fill();
    
    // Draw QR Code Image
    if (qrImg) {
        ctx.drawImage(qrImg, 200 - 95, 190, 190, 190);
    }
    
    // 5. Draw Dashed Divider
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(30, 420);
    ctx.lineTo(370, 420);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // 6. Draw side notches cutouts (transparency)
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(0, 420, 15, 0, Math.PI * 2);
    ctx.arc(400, 420, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    
    // 7. Render information text fields
    ctx.textAlign = 'left';
    let currentY = 455;
    
    const drawInfo = (lbl, val, isGold = false) => {
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 10px "Outfit", "Inter", sans-serif';
        ctx.fillText(lbl.toUpperCase(), 35, currentY);
        
        ctx.fillStyle = isGold ? '#eab308' : '#f8fafc';
        ctx.font = isGold ? 'bold 16px "Outfit", "Inter", sans-serif' : '600 13px "Outfit", "Inter", sans-serif';
        ctx.fillText(val, 35, currentY + 18);
        
        currentY += 42;
    };
    
    drawInfo('Visitante', nombre, true);
    if (tipo === 'persona') {
        drawInfo('Documento', doc);
    }
    drawInfo('Motivo de Visita', motivo);
    drawInfo('Expira el', expira);
    drawInfo('Anfitrión Autorizador', anfitrion);
    
    // 8. Download PNG
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const cleanName = nombre.toLowerCase().replace(/[^a-z0-9]/g, '_');
        a.download = `pase_temporal_${cleanName}.png`;
        a.href = url;
        a.click();
        URL.revokeObjectURL(url);
    }, 'image/png');
}


