// admin-qr.js - Lógica para escaneo QR y registro de accesos

let html5QrCode;
let currentUserData = null;
let currentRole = sessionStorage.getItem('adminRole') || 'seguridad'; // Obtener rol del admin

function showQRScreen() {
    document.getElementById('qr-modal').style.display = 'block';
    startQRScanner();
    loadAccessHistory();
}

function closeQRScreen() {
    document.getElementById('qr-modal').style.display = 'none';
    if (html5QrCode) {
        html5QrCode.stop().then(() => {
            console.log('QR scanner stopped');
        });
    }
    resetUserInfo();
}

function startQRScanner() {
    html5QrCode = new Html5Qrcode("qr-reader");
    html5QrCode.start(
        { facingMode: "environment" },
        {
            fps: 10,
            qrbox: { width: 250, height: 250 }
        },
        onScanSuccess,
        onScanFailure
    ).catch(err => {
        console.log(`Unable to start scanning, error: ${err}`);
    });
}

function onScanSuccess(decodedText, decodedResult) {
    console.log(`Code matched = ${decodedText}`, decodedResult);
    parseQRData(decodedText);
}

function onScanFailure(error) {
    // console.warn(`Code scan error = ${error}`);
}

function parseQRData(qrText) {
    // Asumir formato: "ID: 1234567890 | Estudiante: Juan Ruiz | Rol: estudiante"
    const parts = qrText.split(' | ');
    if (parts.length < 2) {
        showToast('QR inválido', 'error', 'Error');
        return;
    }

    const idMatch = parts[0].match(/ID: (\d+)/);
    const nameMatch = parts[1].match(/Estudiante: (.+)/);
    const rolMatch = parts[2] ? parts[2].match(/Rol: (.+)/) : null;

    if (!idMatch || !nameMatch) {
        showToast('Datos del QR incompletos', 'error', 'Error');
        return;
    }

    currentUserData = {
        id: idMatch[1],
        nombre: nameMatch[1],
        rol: rolMatch ? rolMatch[1] : 'estudiante'
    };

    displayUserInfo();
    validateUser();
}

function displayUserInfo() {
    const infoDiv = document.getElementById('user-info');
    infoDiv.innerHTML = `
        <strong>ID:</strong> ${currentUserData.id}<br>
        <strong>Nombre:</strong> ${currentUserData.nombre}<br>
        <strong>Rol:</strong> ${currentUserData.rol}
    `;
}

function validateUser() {
    // Simular validación con APIs
    checkExternalAPIs().then(status => {
        const statusDiv = document.getElementById('user-status');
        if (status === 'aprobado') {
            statusDiv.textContent = 'Estado: Aprobado';
            statusDiv.style.color = 'green';
            document.getElementById('register-entry').style.display = 'inline-block';
            document.getElementById('register-exit').style.display = 'inline-block';
        } else {
            statusDiv.textContent = `Estado: Bloqueado - ${status}`;
            statusDiv.style.color = 'red';
            document.getElementById('register-entry').style.display = 'none';
            document.getElementById('register-exit').style.display = 'none';
        }
    });
}

async function checkExternalAPIs() {
    // Simular llamadas a APIs según rol del admin
    if (currentRole === 'biblioteca') {
        return await checkBiblioteca(currentUserData.id);
    } else if (currentRole === 'bienestar') {
        return await checkBienestar(currentUserData.id);
    } else if (currentRole === 'TI') {
        return await checkTI(currentUserData.id);
    }
    return 'aprobado'; // Seguridad por defecto
}

function registerAccess(type) {
    if (!currentUserData) return;

    const registro = {
        id_registro: Date.now(),
        id_usuario: currentUserData.id,
        nombre: currentUserData.nombre,
        rol: currentUserData.rol,
        fecha: new Date().toLocaleDateString(),
        hora: new Date().toLocaleTimeString(),
        tipo: type,
        dependencia: currentRole
    };

    saveRegistro(registro);
    showToast(`Registro de ${type} guardado`, 'success', 'Éxito');
    loadAccessHistory();
    resetUserInfo();
}

function saveRegistro(registro) {
    const registros = JSON.parse(localStorage.getItem('registros_accesos') || '[]');
    registros.push(registro);
    localStorage.setItem('registros_accesos', JSON.stringify(registros));
}

function loadAccessHistory() {
    const registros = JSON.parse(localStorage.getItem('registros_accesos') || '[]');
    const filtered = registros.filter(r => r.dependencia === currentRole);
    const list = document.getElementById('history-list');
    list.innerHTML = '';

    filtered.slice(-10).forEach(reg => {
        const li = document.createElement('li');
        li.textContent = `${reg.fecha} ${reg.hora} - ${reg.nombre} (${reg.tipo})`;
        list.appendChild(li);
    });
}

function resetUserInfo() {
    currentUserData = null;
    document.getElementById('user-info').textContent = 'Escanea un código QR para ver la información.';
    document.getElementById('user-status').textContent = 'Estado: Pendiente';
    document.getElementById('register-entry').style.display = 'none';
    document.getElementById('register-exit').style.display = 'none';
}