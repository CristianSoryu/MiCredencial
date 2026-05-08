document.addEventListener("DOMContentLoaded", () => {
    // Verificar si ya hay sesión iniciada
    fetch('../api/auth/login.php')
        .then(response => response.json())
        .then(data => {
            if (data.success && data.redirect) {
                window.location.href = data.redirect;
            }
        })
        .catch(error => console.error("Error al comprobar sesión:", error));
});

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const errorMsg = document.getElementById('error-msg');
    const submitBtn = document.getElementById('submit-btn');
    
    const documento = document.getElementById('login-id').value;
    const password = document.getElementById('login-password').value;
    
    errorMsg.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Iniciando...';
    
    fetch('../api/auth/login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ documento, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = data.redirect;
        } else {
            errorMsg.textContent = data.message;
            errorMsg.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Iniciar Sesion';
        }
    })
    .catch(error => {
        console.error("Error en login:", error);
        errorMsg.textContent = "Error de red al intentar iniciar sesión.";
        errorMsg.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Iniciar Sesion';
    });
});

