document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submit-btn');
    
    // Obtener los valores de los campos
    const nombreCompleto = document.getElementById('reg-nombre').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const tipoDoc = document.getElementById('reg-tipo-doc').value;
    const programa = document.getElementById('reg-programa').value;
    const documento = document.getElementById('reg-id').value.trim();
    const password = document.getElementById('reg-password').value;
    
    // Dividir el nombre completo en nombres y apellidos de manera sencilla
    const partes = nombreCompleto.split(' ');
    const nombres = partes.slice(0, Math.ceil(partes.length / 2)).join(' ');
    const apellidos = partes.slice(Math.ceil(partes.length / 2)).join(' ') || '.'; // Por si pone una sola palabra
    
    // Validar correo institucional
    if (!email.endsWith('@unilibre.edu.co')) {
        showToast('El correo debe ser institucional (@unilibre.edu.co).', 'error');
        return;
    }
    
    // Validar que el documento sea solo números sin límite de longitud
    if (!/^\d+$/.test(documento)) {
        showToast('El número de documento debe contener solo números.', 'error');
        return;
    }
    
    // Validar contraseña (mínimo 6 caracteres)
    if (password.length < 6) {
        showToast('La contraseña debe tener al menos 6 caracteres.', 'error');
        return;
    }
    
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
            programa: programa,
            nombres: nombres,
            apellidos: apellidos,
            email: email,
            contrasena: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast("¡Registro exitoso! Redirigiendo al login...", 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            showToast(data.message || "Error al registrarse.", 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar solicitud';
        }
    })
    .catch(error => {
        console.error("Error en registro:", error);
        showToast("Error de red al intentar registrarse.", 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar solicitud';
    });
});

