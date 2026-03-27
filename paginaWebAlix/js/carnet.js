// Todo lo relacionado con mostrar el carnet digital.
function mostrarCarnet(user) {
    if (!user) return;

    // 1. Asignar los datos a los elementos del HTML
    document.getElementById('carnet-nombre').textContent = user.nombre;
    document.getElementById('carnet-id').textContent = user.identificacion;
    document.getElementById('carnet-programa').textContent = user.programa;
    document.getElementById('carnet-vencimiento').textContent = user.vencimiento || "2026-2";

    // 2. Limpiar el contenedor del QR para que no se dupliquen al recargar
    const qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = ""; 

    // 3. Generar el nuevo código QR
    // Usamos un texto más limpio para el QR en lugar de todo el JSON (opcional)
    const qrData = `ID: ${user.identificacion} | Estudiante: ${user.nombre}`;
    
    new QRCode(qrContainer, {
        text: qrData,
        width: 150,
        height: 150,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    // 4. Cambiar a la vista del carnet
    if (typeof showView === "function") {
        showView('carnet');
    }
}

function logout() {
    // Borrar los datos de la sesión
    localStorage.removeItem("carnet");
    currentUser = null;
    
    // Redirigir al login
    if (typeof showView === "function") {
        showView("login");
    } else {
        // Si no tienes showView, podrías usar:
        window.location.href = "login.html"; 
    }
}