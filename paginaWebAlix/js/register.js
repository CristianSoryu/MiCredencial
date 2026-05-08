document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const errorMsg = document.getElementById('error-msg');
    const successMsg = document.getElementById('success-msg');
    const submitBtn = document.getElementById('submit-btn');
    
    // Obtener los valores de los campos
    const nombreCompleto = document.getElementById('reg-nombre').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const tipoDoc = document.getElementById('reg-tipo-doc').value;
    const documento = document.getElementById('reg-id').value.trim();
    const password = document.getElementById('reg-password').value;
    
    // Dividir el nombre completo en nombres y apellidos de manera sencilla
    const partes = nombreCompleto.split(' ');
    const nombres = partes.slice(0, Math.ceil(partes.length / 2)).join(' ');
    const apellidos = partes.slice(Math.ceil(partes.length / 2)).join(' ') || '.'; // Por si pone una sola palabra
    
    if (!email.endsWith('@unilibre.edu.co')) {
        errorMsg.textContent = 'El correo debe ser institucional (@unilibre.edu.co).';
        errorMsg.style.display = 'block';
        return;
    }
    
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    
    fetch('../api/auth/register.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            id_usuario: documento,
            tipo_documento: tipoDoc,
            nombres: nombres,
            apellidos: apellidos,
            email: email,
            contrasena: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            successMsg.textContent = "¡Registro exitoso! Redirigiendo al login...";
            successMsg.style.display = 'block';
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            errorMsg.textContent = data.message;
            errorMsg.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar solicitud';
        }
    })
    .catch(error => {
        console.error("Error en registro:", error);
        errorMsg.textContent = "Error de red al intentar registrarse.";
        errorMsg.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar solicitud';
    });
});

