document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('recovery-form');
    const emailInput = document.getElementById('recovery-email');
    const message = document.getElementById('recovery-message');

    if (!form || !emailInput || !message) {
        return;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const email = emailInput.value.trim();
        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!emailValido) {
            message.style.display = 'block';
            message.style.color = '#c4001a';
            message.textContent = 'Por favor ingresa un correo electronico valido.';
            showToast('Revisa el correo electronico ingresado.', 'error', 'Correo invalido');
            return;
        }

        const temporalPassword = generarContrasenaTemporal();
        setStoredPassword(temporalPassword);

        message.style.display = 'block';
        message.style.color = '#1f6f43';
        message.innerHTML = `Se envio una contraseña temporal al correo <strong>${email}</strong>.<br>Contraseña temporal de prueba: <strong>${temporalPassword}</strong>`;
        showToast('Se genero una contraseña temporal para tu acceso.', 'success', 'Recuperacion lista');

        form.reset();
    });
});

function generarContrasenaTemporal() {
    const caracteres = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
    let resultado = '';

    for (let i = 0; i < 10; i += 1) {
        const indice = Math.floor(Math.random() * caracteres.length);
        resultado += caracteres[indice];
    }

    return resultado;
}
