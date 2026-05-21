function requireAdminAuth() {
    fetch('../api/admin/check_session.php')
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                window.location.href = '../html/index.html';
            }
        })
        .catch(error => {
            console.error("Error validando sesión:", error);
            window.location.href = '../html/index.html';
        });
}

function adminLogout() {
    fetch('../api/auth/logout.php', { method: 'POST' })
        .then(() => {
            window.location.href = '../html/index.html';
        })
        .catch(() => {
            window.location.href = '../html/index.html';
        });
}
