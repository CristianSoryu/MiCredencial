// Logica de inicio de sesion.
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (!loginForm) {
        return;
    }

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const identificador = document.getElementById('login-id').value.trim();
        const contrasena = document.getElementById('login-password').value;
        let passwordGuardada = getStoredPassword();
        const identificacionValida = /^\d+$/.test(identificador);

        if (!identificador || !contrasena) {
            showToast('Ingresa tu identificacion y la contraseña.', 'error');
            return;
        }

        if (!identificacionValida) {
            showToast('El ID debe contener solo números.', 'error');
            return;
        }

        if (!passwordGuardada) {
            setStoredPassword(contrasena);
            passwordGuardada = contrasena;
        }

        if (contrasena !== passwordGuardada) {
            showToast('La contraseña no coincide con la registrada.', 'error');
            return;
        }

        showToast('Ingreso exitoso. Redirigiendo a tu carnet.', 'success');

        setTimeout(() => {
            window.location.href = 'carnet.html';
        }, 900);
    });
});

