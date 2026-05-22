let html5QrcodeScanner = null;
let currentUserId = null;

document.addEventListener("DOMContentLoaded", () => {
    // Verificar autorización
    fetch('../api/carnet/get_carnet.php')
        .then(response => response.json())
        .then(data => {
            const roles = data.usuario.todos_los_roles || [];
            const esAdmin = roles.includes('administrador') || data.usuario.rol === 'administrador';
            const esEscaneadorSeguridad = roles.includes('escaneador') || esAdmin;
            const esEscaneadorBienestar = roles.includes('escaneador de bienestar') || roles.includes('bienestar') || esAdmin;
            const esEscaneadorBiblioteca = roles.includes('escaneador de biblioteca') || roles.includes('biblioteca') || esAdmin;

            if (!data.success || (!esEscaneadorSeguridad && !esEscaneadorBienestar && !esEscaneadorBiblioteca)) {
                alert("Acceso no autorizado. Se requiere rol de escaneador.");
                window.location.href = 'index.html';
                return;
            }
            
            window.userRoles = roles;
            window.esEscaneadorSeguridad = esEscaneadorSeguridad;
            window.esEscaneadorBienestar = esEscaneadorBienestar;
            window.esEscaneadorBiblioteca = esEscaneadorBiblioteca;

            // Ocultar botones a los que el usuario no tiene acceso
            const btnSeg = document.getElementById('btn-modo-seguridad');
            const btnBien = document.getElementById('btn-modo-bienestar');
            const btnBib = document.getElementById('btn-modo-biblioteca');

            if (!esEscaneadorSeguridad && btnSeg) btnSeg.style.display = 'none';
            if (!esEscaneadorBienestar && btnBien) btnBien.style.display = 'none';
            if (!esEscaneadorBiblioteca && btnBib) btnBib.style.display = 'none';

            // Contar cuántos roles activos de escáner posee
            const totalRolesEscaneo = (esEscaneadorSeguridad ? 1 : 0) + (esEscaneadorBienestar ? 1 : 0) + (esEscaneadorBiblioteca ? 1 : 0);

            if (totalRolesEscaneo > 1) {
                document.getElementById('modo-escaner-container').style.display = 'block';
            } else {
                document.getElementById('modo-escaner-container').style.display = 'none';
            }

            // Definir modo inicial de escaneo
            if (esEscaneadorSeguridad) {
                window.modoEscaneo = 'seguridad';
            } else if (esEscaneadorBienestar) {
                window.modoEscaneo = 'bienestar';
            } else if (esEscaneadorBiblioteca) {
                window.modoEscaneo = 'biblioteca';
            } else {
                window.modoEscaneo = 'seguridad';
            }

            actualizarInterfazModo();
            
            // Si es autorizado, iniciar escáner
            iniciarScanner();
        })
        .catch(error => {
            console.error("Error de autorización:", error);
            window.location.href = 'index.html';
        });
});

function iniciarScanner() {
    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
        // Pausar el escáner para evitar lecturas múltiples del mismo QR
        if (html5QrcodeScanner.getState() === Html5QrcodeScannerState.SCANNING) {
            html5QrcodeScanner.pause(true);
            procesarQR(decodedText);
        }
    };

    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    html5QrcodeScanner = new Html5Qrcode("reader");
    html5QrcodeScanner.start({ facingMode: "environment" }, config, qrCodeSuccessCallback)
    .then(() => {
        document.getElementById('scanner-status').textContent = 'Cámara lista. Apunte al código QR.';
    })
    .catch((err) => {
        console.error("Error iniciando cámara", err);
        document.getElementById('scanner-status').textContent = 'Error al acceder a la cámara. Verifique los permisos en el navegador.';
    });
}

function procesarQR(qrData) {
    document.getElementById('scanner-status').textContent = 'Procesando QR...';
    
    fetch('../api/escaner/procesar_qr.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qr_data: qrData })
    })
    .then(async response => {
        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch (e) {
            console.error("Respuesta no es JSON:", text);
            throw new Error("El servidor no devolvió un JSON válido. Revisa la consola.");
        }
    })
    .then(data => {
        if (data.success) {
            mostrarPanelUsuario(data.usuario);
        } else {
            alert("Error: " + data.message);
            reanudarEscaneo();
        }
    })
    .catch(error => {
        console.error("Error detallado:", error);
        alert("Error de comunicación con el servidor: " + error.message);
        reanudarEscaneo();
    });
}

function actualizarInterfazModo() {
    const btnSeg = document.getElementById('btn-modo-seguridad');
    const btnBien = document.getElementById('btn-modo-bienestar');
    const btnBib = document.getElementById('btn-modo-biblioteca');
    
    if (btnSeg) btnSeg.classList.remove('active');
    if (btnBien) btnBien.classList.remove('active');
    if (btnBib) btnBib.classList.remove('active');

    if (window.modoEscaneo === 'bienestar') {
        if (btnBien) btnBien.classList.add('active');
    } else if (window.modoEscaneo === 'biblioteca') {
        if (btnBib) btnBib.classList.add('active');
    } else {
        if (btnSeg) btnSeg.classList.add('active');
    }
}

function cambiarModoEscaneo(nuevoModo) {
    if (nuevoModo === 'seguridad' && !window.esEscaneadorSeguridad) {
        alert("No tiene permisos de escáner de seguridad.");
        return;
    }
    if (nuevoModo === 'bienestar' && !window.esEscaneadorBienestar) {
        alert("No tiene permisos de escáner de Bienestar.");
        return;
    }
    if (nuevoModo === 'biblioteca' && !window.esEscaneadorBiblioteca) {
        alert("No tiene permisos de escáner de Biblioteca.");
        return;
    }
    window.modoEscaneo = nuevoModo;
    actualizarInterfazModo();
    cancelarEscaneo();
}

function mostrarPanelUsuario(usuario) {
    document.getElementById('scanner-section').style.display = 'none';
    document.getElementById('usuario-panel').style.display = 'block';

    currentUserId = usuario.id_usuario;

    const panelAcceso = document.getElementById('acciones-acceso');
    const panelPrestamos = document.getElementById('acciones-prestamos');
    const perfilInfo = document.querySelector('.perfil-info');
    const tempScanInfo = document.getElementById('temp-scan-info');

    if (usuario.es_temporal) {
        if (perfilInfo) perfilInfo.style.display = 'none';
        if (tempScanInfo) tempScanInfo.style.display = 'block';

        document.getElementById('temp-scan-visitor').textContent = usuario.nombre_completo;
        
        const docRow = document.getElementById('temp-scan-doc-row');
        if (usuario.tipo_temporal === 'grupo') {
            if (docRow) docRow.style.display = 'none';
        } else {
            if (docRow) {
                docRow.style.display = 'block';
                document.getElementById('temp-scan-doc').textContent = usuario.identificacion;
            }
        }

        document.getElementById('temp-scan-reason').textContent = usuario.motivo;
        document.getElementById('temp-scan-host').textContent = usuario.anfitrion;
        document.getElementById('temp-scan-expires').textContent = usuario.fecha_expiracion;

        if (panelPrestamos) panelPrestamos.style.display = 'none';
        if (panelAcceso) panelAcceso.style.display = 'block';
        return;
    }

    if (perfilInfo) perfilInfo.style.display = 'flex';
    if (tempScanInfo) tempScanInfo.style.display = 'none';

    document.getElementById('scan-nombre').textContent = usuario.nombre_completo;
    document.getElementById('scan-id').textContent = usuario.identificacion;
    document.getElementById('scan-rol').textContent = usuario.rol.toUpperCase();

    const scanProgEl = document.getElementById('scan-programa');
    const labelScanEl = document.getElementById('label-scan-programa');
    if (scanProgEl && usuario.programa) {
        scanProgEl.textContent = usuario.programa;
        if (usuario.programa.startsWith('Docente') || usuario.programa === 'Administrativo') {
            if (labelScanEl) labelScanEl.textContent = 'Cargo:';
        } else {
            if (labelScanEl) labelScanEl.textContent = 'Programa:';
        }
    }

    const fotoImg = document.getElementById('scan-foto');
    if (usuario.foto) {
        fotoImg.src = usuario.foto;
    } else {
        fotoImg.src = '../IMG/escudo.png';
    }

    if (window.modoEscaneo === 'bienestar' || window.modoEscaneo === 'biblioteca') {
        if (panelAcceso) panelAcceso.style.display = 'none';
        if (panelPrestamos) panelPrestamos.style.display = 'block';

        const isBiblioteca = window.modoEscaneo === 'biblioteca';
        
        // Ajustar textos e iconos dinámicamente según el modo
        const panelTitulo = document.getElementById('prestamos-panel-titulo');
        const elementoLabel = document.getElementById('pres-elemento-label');
        const elementoIcono = document.getElementById('pres-elemento-icono');

        if (isBiblioteca) {
            if (panelTitulo) panelTitulo.innerHTML = '<i class="fas fa-book"></i> Préstamos Biblioteca:';
            if (elementoLabel) elementoLabel.textContent = 'Libro Prestado';
            if (elementoIcono) {
                elementoIcono.className = '';
                elementoIcono.classList.add('fas', 'fa-book-open');
            }
        } else {
            if (panelTitulo) panelTitulo.innerHTML = '<i class="fas fa-basketball-ball"></i> Préstamos Bienestar Universitario:';
            if (elementoLabel) elementoLabel.textContent = 'Elemento Prestado';
            if (elementoIcono) {
                elementoIcono.className = '';
                elementoIcono.classList.add('fas', 'fa-table-tennis');
            }
        }

        // Llenar datos de usuario común
        document.getElementById('pres-documento').textContent = usuario.identificacion;
        document.getElementById('pres-vinculo').textContent = usuario.rol.toUpperCase();
        
        const presProgEl = document.getElementById('pres-programa');
        const labelPresEl = document.getElementById('label-pres-programa');
        if (presProgEl && usuario.programa) {
            presProgEl.textContent = usuario.programa;
            if (usuario.programa.startsWith('Docente') || usuario.programa === 'Administrativo') {
                if (labelPresEl) labelPresEl.textContent = 'Cargo:';
            } else {
                if (labelPresEl) labelPresEl.textContent = 'Programa:';
            }
        } else if (presProgEl) {
            presProgEl.textContent = 'No especificado';
        }

        // Obtener el objeto de préstamos correspondiente
        const prestamo = isBiblioteca 
            ? (usuario.prestamo_biblioteca || { tiene_prestamo: false, estado: 'ninguno' })
            : (usuario.prestamo || { tiene_prestamo: false, estado: 'ninguno' });

        const badge = document.getElementById('prestamo-estado-badge');
        const card = document.getElementById('prestamo-card-container');
        const alertBox = document.getElementById('prestamo-reporte-alert');
        const containerElemento = document.getElementById('container-elemento');
        const containerFechas = document.getElementById('container-fechas');

        if (card) {
            card.className = "prestamo-card " + prestamo.estado;
        }

        if (prestamo.tiene_prestamo) {
            if (prestamo.estado === 'activo') {
                badge.textContent = "Préstamo Activo";
                badge.className = "prestamo-badge badge-activo";
            } else {
                badge.textContent = "Préstamo Vencido";
                badge.className = "prestamo-badge badge-vencido";
            }

            if (containerElemento) containerElemento.style.display = 'block';
            if (containerFechas) containerFechas.style.display = 'block';
            
            // Mostrar libro o elemento deportivo según corresponda
            document.getElementById('pres-elemento').textContent = isBiblioteca ? prestamo.libro : prestamo.elemento;
            document.getElementById('pres-fecha-inicio').textContent = prestamo.fecha_prestamo;
            document.getElementById('pres-fecha-vence').textContent = prestamo.fecha_vencimiento;
        } else {
            badge.textContent = isBiblioteca ? "Sin préstamos de libros pendientes" : "Sin préstamos pendientes";
            badge.className = "prestamo-badge badge-ninguno";
            if (containerElemento) containerElemento.style.display = 'none';
            if (containerFechas) containerFechas.style.display = 'none';
        }

        if (prestamo.reporte) {
            if (alertBox) alertBox.style.display = 'flex';
            document.getElementById('pres-reporte-texto').textContent = prestamo.reporte;
        } else {
            if (alertBox) alertBox.style.display = 'none';
        }
    } else {
        if (panelAcceso) panelAcceso.style.display = 'block';
        if (panelPrestamos) panelPrestamos.style.display = 'none';
    }
}

function registrarAcceso(tipo, metodo) {
    if (!currentUserId) return;

    fetch('../api/escaner/registrar_acceso.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id_usuario: currentUserId,
            tipo: tipo,
            metodo: metodo
        })
    })
    .then(async response => {
        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch (e) {
            console.error("Respuesta no es JSON:", text);
            throw new Error("Respuesta inválida del servidor.");
        }
    })
    .then(data => {
        if (data.success) {
            const accion = tipo.charAt(0).toUpperCase() + tipo.slice(1);
            if (typeof showToast === 'function') {
                showToast(`${accion} ${metodo} registrada correctamente.`, 'success');
            } else {
                alert(`${accion} ${metodo} registrada correctamente.`);
            }
            
            setTimeout(() => {
                cancelarEscaneo();
            }, 1500);
        } else {
            alert("Error al registrar: " + data.message);
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Error de comunicación: " + error.message);
    });
}

function cancelarEscaneo() {
    currentUserId = null;
    const tempScanInfo = document.getElementById('temp-scan-info');
    const perfilInfo = document.querySelector('.perfil-info');
    if (tempScanInfo) tempScanInfo.style.display = 'none';
    if (perfilInfo) perfilInfo.style.display = 'flex';
    document.getElementById('usuario-panel').style.display = 'none';
    document.getElementById('scanner-section').style.display = 'block';
    document.getElementById('scanner-status').textContent = 'Cámara lista. Apunte al código QR.';
    reanudarEscaneo();
}

function reanudarEscaneo() {
    if (html5QrcodeScanner && html5QrcodeScanner.getState() === Html5QrcodeScannerState.PAUSED) {
        html5QrcodeScanner.resume();
    }
}

// ==================== CARNET TEMPORAL FUNCTIONS FOR ESCANER PORTERIA ====================

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
    
    if (tipo === 'grupo') {
        lblNombre.textContent = "Nombre del Grupo / Delegación";
        inputNombre.placeholder = "Ej. Colegio Gimnasio Moderno";
        groupDoc.style.display = 'none';
        inputDoc.required = false;
        inputDoc.value = '';
    } else {
        lblNombre.textContent = "Nombre del Visitante";
        inputNombre.placeholder = "Ej. Juan Pérez";
        groupDoc.style.display = 'block';
        inputDoc.required = true;
    }
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
            mostrarTicketTemporal(data.carnet);
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(err => {
        console.error('Error al generar carnet temporal:', err);
        alert('Ocurrió un error al generar el carnet temporal.');
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


