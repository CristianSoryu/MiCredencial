document.addEventListener("DOMContentLoaded", () => {
    fetch('../api/admin/check_session.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('admin-body').style.display = 'block';
            } else {
                window.location.href = data.redirect;
            }
        })
        .catch(error => {
            console.error("Error al comprobar sesión:", error);
            window.location.href = 'login.html';
        });
});

function logoutAdmin(e) {
    e.preventDefault();
    fetch('../api/auth/logout.php', { method: 'POST' })
        .then(() => window.location.href = 'login.html')
        .catch(() => window.location.href = 'login.html');
}

