let documentoEstudiante = "";
let intervalId = null;

document.addEventListener("DOMContentLoaded", () => {
    fetch('../api/carnet/get_carnet.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('cargando-datos').style.display = 'none';
                document.getElementById('datos-carnet').style.display = 'block';
                
                document.getElementById('carnet-nombre').textContent = data.usuario.nombre_completo;
                document.getElementById('carnet-id').textContent = data.usuario.identificacion;
                
                const rol = data.usuario.rol ? data.usuario.rol.toLowerCase() : 'estudiante';
                const badge = document.getElementById('badge-rol');
                if (badge) {
                    badge.textContent = rol.toUpperCase();
                }

                const carnetDiv = document.getElementById('datos-carnet');
                carnetDiv.classList.remove('carnet-docente', 'carnet-administrativo', 'carnet-bienestar');
                if (rol === 'docente') {
                    carnetDiv.classList.add('carnet-docente');
                } else if (rol === 'administrativo' || rol === 'bienestar') {
                    carnetDiv.classList.add('carnet-administrativo');
                }
                
                if (data.usuario.foto) {
                    document.getElementById('foto-perfil').src = data.usuario.foto;
                } else {
                    document.getElementById('foto-perfil').src = '../IMG/escudo.png'; // Fallback
                    alert('¡Atención! Debes cargar una foto para tu carnet virtual.');
                }
                
                documentoEstudiante = data.usuario.documento_puro;
                actualizarQR();
                intervalId = setInterval(actualizarQR, 60000);
            } else {
                window.location.href = data.redirect || 'index.html';
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
                alert('Selecciona un archivo de imagen válido.');
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
                        alert('Error al guardar la foto en el servidor: ' + resData.message);
                    }
                })
                .catch(err => console.error('Error subiendo foto:', err));
            };
            lector.readAsDataURL(archivo);
        });
    }
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

