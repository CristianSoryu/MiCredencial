document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-egresados');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nombres = document.getElementById('nombres').value.trim();
            const identificacion = document.getElementById('identificacion').value.trim();
            const correo = document.getElementById('correo').value.trim();
            const programa_academico = document.getElementById('programa_academico').value;

            if (!nombres || !identificacion || !correo || !programa_academico) {
                alert('Por favor complete todos los campos requeridos.');
                return;
            }

            try {
                const response = await fetch('../api/egresados/submit_request.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        nombres,
                        identificacion,
                        correo,
                        programa_academico
                    })
                });

                const data = await response.json();

                if (data.success) {
                    alert(data.message);
                    form.reset();
                    window.location.href = 'index.html'; // Redirigir al inicio después del éxito
                } else {
                    alert('Error: ' + data.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Hubo un error en la conexión con el servidor. Inténtelo más tarde.');
            }
        });
    }
});
