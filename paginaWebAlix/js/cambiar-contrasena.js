document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('change-password-form');
    const currentPasswordInput = document.getElementById('current-password');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const message = document.getElementById('change-password-message');

    if (!form || !currentPasswordInput || !newPasswordInput || !confirmPasswordInput || !message) {
        return;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const currentPassword = currentPasswordInput.value;
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const storedPassword = getStoredPassword();

        if (currentPassword !== storedPassword) {
            message.style.display = 'block';
            message.style.color = '#c4001a';
            message.textContent = 'La contrasena actual no coincide.';
            showToast('La contrasena actual no es correcta.', 'error', 'No se pudo actualizar');
            return;
        }

        if (newPassword.length < 8) {
            message.style.display = 'block';
            message.style.color = '#c4001a';
            message.textContent = 'La nueva contrasena debe tener al menos 8 caracteres.';
            showToast('Usa una contrasena de minimo 8 caracteres.', 'error', 'Contrasena insegura');
            return;
        }

        if (newPassword !== confirmPassword) {
            message.style.display = 'block';
            message.style.color = '#c4001a';
            message.textContent = 'La confirmacion no coincide con la nueva contrasena.';
            showToast('Las contrasenas nuevas no coinciden.', 'error', 'Verifica los datos');
            return;
        }

        setStoredPassword(newPassword);
        message.style.display = 'block';
        message.style.color = '#1f6f43';
        message.textContent = 'La contrasena fue actualizada correctamente.';
        showToast('Tu contrasena ya quedo actualizada.', 'success', 'Cambio realizado');

        form.reset();
    });
});
