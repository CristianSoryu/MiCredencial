document.addEventListener("DOMContentLoaded", () => {
    fetch('../api/admin/login.php')
        .then(response => response.json())
        .then(data => {
            if (data.success && data.redirect) {
                window.location.href = data.redirect;
            }
        })
        .catch(error => console.error("Error al comprobar sesión:", error));
});

document.getElementById('admin-login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const errorMsg = document.getElementById('error-msg');
    const submitBtn = document.getElementById('submit-btn');
    
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    
    errorMsg.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Ingresando...';
    
    fetch('../api/admin/login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = data.redirect;
        } else {
            errorMsg.textContent = data.message;
            errorMsg.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Ingresar al panel';
        }
    })
    .catch(error => {
        console.error("Error en login:", error);
        errorMsg.textContent = "Error de red al intentar iniciar sesión.";
        errorMsg.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Ingresar al panel';
    });
});

