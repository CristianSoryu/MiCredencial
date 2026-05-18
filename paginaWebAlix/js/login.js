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
    
    const submitBtn = document.getElementById('submit-btn');
    
    const documento = document.getElementById('login-id').value.trim();
    const password = document.getElementById('login-password').value;
    
    if (!/^\d+$/.test(documento)) {
        showToast('La identificación debe contener solo números.', 'error');
        return;
    }
    
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
            showToast("Sesión iniciada con éxito", 'success');
            setTimeout(() => {
                window.location.href = data.redirect;
            }, 1500);
        } else {
            showToast(data.message, 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Iniciar Sesion';
        }
    })
    .catch(error => {
        console.error("Error en login:", error);
        showToast("Error de red al intentar iniciar sesión.", 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Iniciar Sesion';
    });
});

