const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Admin123';

function isAdminAuthenticated() {
    return sessionStorage.getItem('adminSessionActive') === 'true';
}

function requireAdminAuth() {
    if (isAdminAuthenticated()) {
        return true;
    }

    window.location.href = 'login.html';
    return false;
}

function adminLogout() {
    sessionStorage.removeItem('adminSessionActive');
    sessionStorage.removeItem('adminUsername');
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('admin-login-form');

    if (!loginForm) {
        return;
    }

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = document.getElementById('admin-username').value.trim();
        const password = document.getElementById('admin-password').value;

        if (!username || !password) {
            showToast('Ingresa usuario y contrasena.', 'error', 'Datos incompletos');
            return;
        }

        if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
            showToast('Usuario o contrasena incorrectos.', 'error', 'Acceso denegado');
            return;
        }

        sessionStorage.setItem('adminSessionActive', 'true');
        sessionStorage.setItem('adminUsername', username);
        showToast('Acceso autorizado. Entrando al panel.', 'success', 'Sesion admin');

        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 700);
    });
});
