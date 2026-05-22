// Manejo del tipo de usuario para mostrar/ocultar los campos correspondientes
document.getElementById('reg-tipo-usuario').addEventListener('change', function() {
    const tipo = this.value;
    const carreras = document.getElementById('carreras-container');
    const facultades = document.getElementById('facultades-container');
    const selectPrograma = document.getElementById('reg-programa');
    const selectFacultad = document.getElementById('reg-facultad');

    if (tipo === 'estudiante') {
        carreras.style.display = 'block';
        facultades.style.display = 'none';
        selectPrograma.required = true;
        selectFacultad.required = false;
    } else if (tipo === 'docente') {
        carreras.style.display = 'none';
        facultades.style.display = 'block';
        selectPrograma.required = false;
        selectFacultad.required = true;
    } else {
        carreras.style.display = 'none';
        facultades.style.display = 'none';
        selectPrograma.required = false;
        selectFacultad.required = false;
    }
});

// Enviar formulario de registro
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
    
    // Determinar valor de cargo/programa académico según la selección
    const tipoUsuario = document.getElementById('reg-tipo-usuario').value;
    let programa = '';
    
    if (tipoUsuario === 'estudiante') {
        programa = document.getElementById('reg-programa').value;
        if (!programa) {
            errorMsg.textContent = 'Por favor seleccione su programa académico.';
            errorMsg.style.display = 'block';
            return;
        }
    } else if (tipoUsuario === 'docente') {
        const facultad = document.getElementById('reg-facultad').value;
        if (!facultad) {
            errorMsg.textContent = 'Por favor seleccione su facultad.';
            errorMsg.style.display = 'block';
            return;
        }
        programa = 'Docente - Facultad de ' + facultad;
    } else if (tipoUsuario === 'administrativo') {
        programa = 'Administrativo';
    }
    
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
            contrasena: password,
            programa_academico: programa
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
