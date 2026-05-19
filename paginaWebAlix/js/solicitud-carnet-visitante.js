// js/solicitud-carnet-visitante.js

document.addEventListener('DOMContentLoaded', () => {
    const formVisitante = document.getElementById('form-visitante');
    const formContainer = document.getElementById('form-container');
    const carnetContainer = document.getElementById('carnet-generado-container');
    const btnNuevaSolicitud = document.getElementById('btn-nueva-solicitud');

    if (formVisitante) {
        formVisitante.addEventListener('submit', (e) => {
            e.preventDefault();

            // Obtener valores del formulario
            const nombre = document.getElementById('visitante-nombre').value.trim();
            const identificacion = document.getElementById('visitante-id').value.trim();
            const institucion = document.getElementById('visitante-institucion').value.trim();
            const motivo = document.getElementById('visitante-motivo').value;
            const fechaVisita = document.getElementById('visitante-fecha').value;

            if (!nombre || !identificacion || !institucion || !motivo || !fechaVisita) {
                alert("Por favor completa todos los campos requeridos.");
                return;
            }

            const data = {
                nombre_completo: nombre,
                identificacion: identificacion,
                institucion: institucion,
                motivo: motivo,
                fecha_visita: fechaVisita
            };

            // Enviar datos a la base de datos
            fetch('../api/visitantes/guardar_visitante.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if(result.success) {
                    // Fecha de creación (Hoy)
                    const hoy = new Date();
                    const fechaCreacion = hoy.toISOString().split('T')[0];

                    // Mostrar en el carnet
                    document.getElementById('carnet-nombre-display').textContent = nombre;
                    document.getElementById('carnet-institucion-display').textContent = institucion;
                    document.getElementById('carnet-creacion-display').textContent = fechaCreacion;
                    document.getElementById('carnet-vencimiento-display').textContent = fechaVisita;

                    // Generar QR (Codificado para el escáner)
                    // El formato será VISITANTE_idVisitante
                    const qrDataRaw = `VISITANTE_${result.id_visitante}`;
                    const qrData = btoa(qrDataRaw); // Codificar en Base64 para el escáner
                    
                    const qrContainer = document.getElementById('qrcode');
                    qrContainer.innerHTML = ""; // Limpiar qr anterior si lo hay

                    new QRCode(qrContainer, {
                        text: qrData,
                        width: 65,
                        height: 65,
                        colorDark: "#000000",
                        colorLight: "#ffffff",
                        correctLevel: QRCode.CorrectLevel.H
                    });

                    // Ocultar formulario, mostrar carnet
                    formContainer.style.display = 'none';
                    carnetContainer.style.display = 'block';
                } else {
                    alert("Error al registrar la visita: " + result.message);
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Hubo un error de conexión al intentar guardar los datos.");
            });
        });
    }

    if (btnNuevaSolicitud) {
        btnNuevaSolicitud.addEventListener('click', () => {
            formVisitante.reset();
            carnetContainer.style.display = 'none';
            formContainer.style.display = 'block';
        });
    }
});
