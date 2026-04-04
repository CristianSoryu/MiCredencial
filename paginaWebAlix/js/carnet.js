// Todo lo relacionado con mostrar el carnet digital.
function mostrarCarnet(user) {
    if (!user) {
        return;
    }

    const fotoPerfil = document.getElementById('foto-perfil');

    document.getElementById('carnet-nombre').textContent = user.nombre;
    document.getElementById('carnet-id').textContent = user.identificacion;
    document.getElementById('carnet-programa').textContent = user.programa;
    document.getElementById('carnet-vencimiento').textContent = user.vencimiento || '2026-2';

    if (fotoPerfil && user.foto) {
        fotoPerfil.src = user.foto;
    }

    const qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = '';

    const qrData = `ID: ${user.identificacion} | Estudiante: ${user.nombre}`;

    new QRCode(qrContainer, {
        text: qrData,
        width: 150,
        height: 150,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });

    if (typeof showView === 'function') {
        showView('carnet');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const user = getCurrentCarnet();
    const fotoInput = document.getElementById('foto-input');
    const cambiarFotoBtn = document.getElementById('cambiar-foto-btn');

    if (cambiarFotoBtn && fotoInput) {
        cambiarFotoBtn.addEventListener('click', () => {
            fotoInput.click();
        });

        fotoInput.addEventListener('change', manejarCambioDeFoto);
    }

    if (user) {
        currentUser = user;
        mostrarCarnet(user);
        showToast('Mostrando el ultimo carnet creado en esta sesion.', 'info', 'Carnet cargado');
        return;
    }

    showToast('No hay un carnet activo en esta sesion. Inicia sesion primero.', 'error', 'Sesion no encontrada');

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1200);
});

function manejarCambioDeFoto(event) {
    const archivo = event.target.files && event.target.files[0];

    if (!archivo) {
        return;
    }

    if (!archivo.type.startsWith('image/')) {
        showToast('Selecciona un archivo de imagen valido.', 'error', 'Formato no compatible');
        event.target.value = '';
        return;
    }

    const lector = new FileReader();

    lector.onload = () => {
        const fotoBase64 = lector.result;
        const user = getCurrentCarnet();

        if (!user) {
            showToast('No se encontro un carnet activo para actualizar la imagen.', 'error', 'Sin sesion');
            return;
        }

        user.foto = fotoBase64;
        currentUser = user;
        saveCurrentCarnet(user);
        mostrarCarnet(user);
        showToast('La imagen del carnet fue actualizada.', 'success', 'Cambio guardado');
        event.target.value = '';
    };

    lector.readAsDataURL(archivo);
}

function logout() {
    clearCurrentSession();
    currentUser = null;

    if (typeof showView === 'function') {
        showView('login');
        return;
    }

    showToast('Tu sesion se cerro correctamente.', 'info', 'Sesion finalizada');

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 700);
}
