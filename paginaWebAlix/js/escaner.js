let html5QrcodeScanner = null;
let currentUserId = null;

document.addEventListener("DOMContentLoaded", () => {
    // Verificar autorización
    fetch('../api/carnet/get_carnet.php')
        .then(response => response.json())
        .then(data => {
            const roles = data.usuario.todos_los_roles || [];
            if (!data.success || !roles.includes('escaneador')) {
                alert("Acceso no autorizado. Se requiere rol de escaneador.");
                window.location.href = 'index.html';
                return;
            }
            
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

function mostrarPanelUsuario(usuario) {
    document.getElementById('scanner-section').style.display = 'none';
    document.getElementById('usuario-panel').style.display = 'block';

    currentUserId = usuario.id_usuario;

    document.getElementById('scan-nombre').textContent = usuario.nombre_completo;
    document.getElementById('scan-id').textContent = usuario.identificacion;
    document.getElementById('scan-rol').textContent = usuario.rol.toUpperCase();

    const fotoImg = document.getElementById('scan-foto');
    if (usuario.foto) {
        fotoImg.src = usuario.foto;
    } else {
        fotoImg.src = '../IMG/escudo.png';
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
