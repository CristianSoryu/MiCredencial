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
            alert('Ingresa tu identificacion y la contraseña.');
            return;
        }

        if (!identificacionValida) {
            alert('El ID debe contener solo números.');
            return;
        }

        if (!passwordGuardada) {
            setStoredPassword(contrasena);
            passwordGuardada = contrasena;
        }

        if (contrasena !== passwordGuardada) {
            alert('La contraseña no coincide con la registrada.');
            return;
        }

        const fechaActual = new Date();
        const fechaVencimiento = new Date(
            fechaActual.getFullYear() + 1,
            fechaActual.getMonth(),
            fechaActual.getDate()
        );
        const vencimientoFormato = fechaVencimiento.toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        const dummyUser = {
            nombre: 'Juan Ruiz',
            identificacion: identificador,
            programa: 'Ing en TIC',
            vencimiento: vencimientoFormato,
        };

        currentUser = dummyUser;
        saveCurrentCarnet(currentUser);
        alert('Ingreso exitoso. Redirigiendo a tu carnet.');

        setTimeout(() => {
            window.location.href = 'carnet.html';
        }, 900);
    });
});

