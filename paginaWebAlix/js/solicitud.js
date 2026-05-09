document.getElementById('solicitud-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submit-btn');
    
    const nombre = document.getElementById('sol-nombre').value.trim();
    const documento = document.getElementById('sol-id').value.trim();
    const email = document.getElementById('sol-email').value.trim();
    const programa = document.getElementById('sol-programa').value;
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    
    fetch('../api/solicitud.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            nombre: nombre,
            documento: documento,
            email: email,
            programa: programa
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast("Solicitud enviada exitosamente. Te contactaremos pronto.", 'success');
            document.getElementById('solicitud-form').reset();
        } else {
            showToast(data.message || "Error al enviar la solicitud.", 'error');
        }
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar solicitud';
    })
    .catch(error => {
        console.error("Error en solicitud:", error);
        showToast("Error de red al enviar la solicitud.", 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar solicitud';
    });
});