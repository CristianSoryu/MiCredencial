function ensureToastContainer() {
    let container = document.getElementById('toast-container');

    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    return container;
}

function ensureModalContainer() {
    let container = document.getElementById('modal-container');

    if (!container) {
        container = document.createElement('div');
        container.id = 'modal-container';
        container.className = 'modal-container';
        document.body.appendChild(container);
    }

    return container;
}

function showModal({ title = '', message = '', confirmText = 'Aceptar', cancelText = '', onConfirm = null, onCancel = null }) {
    const container = ensureModalContainer();
    container.innerHTML = '';

    const dialog = document.createElement('div');
    dialog.className = 'modal-dialog';

    if (title) {
        const titleElement = document.createElement('h3');
        titleElement.className = 'modal-title';
        titleElement.textContent = title;
        dialog.appendChild(titleElement);
    }

    const messageElement = document.createElement('p');
    messageElement.className = 'modal-message';
    messageElement.textContent = message;
    dialog.appendChild(messageElement);

    const actions = document.createElement('div');
    actions.className = 'modal-actions';

    if (cancelText) {
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'modal-button modal-button-secondary';
        cancelBtn.textContent = cancelText;
        cancelBtn.addEventListener('click', () => {
            container.remove();
            if (typeof onCancel === 'function') onCancel();
        });
        actions.appendChild(cancelBtn);
    }

    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'modal-button modal-button-primary';
    confirmBtn.textContent = confirmText;
    confirmBtn.addEventListener('click', () => {
        container.remove();
        if (typeof onConfirm === 'function') onConfirm();
    });
    actions.appendChild(confirmBtn);

    dialog.appendChild(actions);
    container.appendChild(dialog);
}

function showToast(message, type = 'info', title = '') {
    const container = ensureToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    if (title) {
        const titleElement = document.createElement('span');
        titleElement.className = 'toast-title';
        titleElement.textContent = title;
        toast.appendChild(titleElement);
    }

    const messageElement = document.createElement('span');
    messageElement.textContent = message;
    toast.appendChild(messageElement);

    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 250);
    }, 3200);
}

function getStoredPassword() {
    return localStorage.getItem('userPassword');
}

function setStoredPassword(password) {
    localStorage.setItem('userPassword', password);
}

function saveCurrentCarnet(user) {
    if (!user) {
        return;
    }

    localStorage.setItem('carnet', JSON.stringify(user));
    localStorage.setItem('sesionActiva', 'true');
    sessionStorage.setItem('ultimoCarnetSesion', JSON.stringify(user));
    sessionStorage.setItem('sesionActiva', 'true');
}

function getCurrentCarnet() {
    const sessionCarnet = sessionStorage.getItem('ultimoCarnetSesion');

    if (sessionCarnet) {
        return JSON.parse(sessionCarnet);
    }

    const sesionActiva = localStorage.getItem('sesionActiva') === 'true';
    const savedCarnet = localStorage.getItem('carnet');
    return sesionActiva && savedCarnet ? JSON.parse(savedCarnet) : null;
}

function clearCurrentSession() {
    sessionStorage.removeItem('ultimoCarnetSesion');
    sessionStorage.removeItem('sesionActiva');
    localStorage.removeItem('sesionActiva');
    localStorage.removeItem('carnet');
}

