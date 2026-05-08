const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Admin123';

function isAdminAuthenticated() {
    return sessionStorage.getItem('adminSessionActive') === 'true';
}

function requireAdminAuth() {
    fetch('../api/admin/check_session.php')
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                window.location.href = 'login.html';
            }
        })
        .catch(error => {
            console.error("Error validando sesión:", error);
            window.location.href = 'login.html';
        });
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
            showToast('Ingresa usuario y contraseña.', 'error', 'Datos incompletos');
            return;
        }

        if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
            showToast('Usuario o contraseña incorrectos.', 'error', 'Acceso denegado');
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

