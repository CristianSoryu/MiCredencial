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
            message.textContent = 'La contraseña actual no coincide.';
            showToast('La contraseña actual no es correcta.', 'error', 'No se pudo actualizar');
            return;
        }

        if (newPassword.length < 8) {
            message.style.display = 'block';
            message.style.color = '#c4001a';
            message.textContent = 'La nueva contraseña debe tener al menos 8 caracteres.';
            showToast('Usa una contraseña de minimo 8 caracteres.', 'error', 'Contraseña insegura');
            return;
        }

        if (newPassword !== confirmPassword) {
            message.style.display = 'block';
            message.style.color = '#c4001a';
            message.textContent = 'La confirmacion no coincide con la nueva contraseña.';
            showToast('Las contraseñas nuevas no coinciden.', 'error', 'Verifica los datos');
            return;
        }

        setStoredPassword(newPassword);
        message.style.display = 'block';
        message.style.color = '#1f6f43';
        message.textContent = 'La contraseña fue actualizada correctamente.';
        showToast('Tu contraseña ya quedo actualizada.', 'success', 'Cambio realizado');

        form.reset();
    });
});
