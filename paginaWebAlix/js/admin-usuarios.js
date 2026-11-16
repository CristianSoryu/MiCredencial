document.addEventListener("DOMContentLoaded", () => {
    cargarRoles().then(() => {
        cargarUsuarios();
    });
});

let rolesCache = [];

function cargarRoles() {
    return fetch('../api/admin/get_roles.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                rolesCache = data.roles;
                console.log("Roles cargados:", rolesCache);
            } else {
                console.error("Error al cargar roles:", data.message);
            }
        })
        .catch(err => console.error("Error de red al cargar roles:", err));
}

function cargarUsuarios() {
    const listaBody = document.getElementById('lista-usuarios-body');
    listaBody.innerHTML = '<tr><td colspan="5">Cargando usuarios...</td></tr>';

    fetch('../api/admin/get_usuarios.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                renderizarUsuarios(data.usuarios);
            } else {
                listaBody.innerHTML = `<tr><td colspan="5">Error: ${data.message}</td></tr>`;
            }
        })
        .catch(error => {
            console.error("Error:", error);
            listaBody.innerHTML = '<tr><td colspan="5">Error de conexión</td></tr>';
        });
}

function renderizarUsuarios(usuarios) {
    const listaBody = document.getElementById('lista-usuarios-body');
    listaBody.innerHTML = '';

    usuarios.forEach(user => {
        const tr = document.createElement('tr');
        
        // Crear selector de roles
        let selectRoles = `<select onchange="cambiarRol('${user.id_usuario}', this.value)">`;
        selectRoles += `<option value="">Sin Rol</option>`;
        rolesCache.forEach(rol => {
            const selected = (rol.id_rol == user.id_rol) ? 'selected' : '';
            selectRoles += `<option value="${rol.id_rol}" ${selected}>${rol.tipo_usuario.toUpperCase()}</option>`;
        });
        selectRoles += `</select>`;

        tr.innerHTML = `
            <td>${user.nombres} ${user.apellidos}</td>
            <td>${user.id_usuario}</td>
            <td>${user.email}</td>
            <td>${selectRoles}</td>
            <td>
                <button class="btn-rechazar" onclick="eliminarUsuario('${user.id_usuario}')" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        listaBody.appendChild(tr);
    });
}

function cambiarRol(idUsuario, idRol) {
    if (!idRol) return;

    fetch('../api/admin/actualizar_rol.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario: idUsuario, id_rol: idRol })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('Rol actualizado correctamente', 'success');
        } else {
            showToast('Error al actualizar rol: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error("Error:", error);
        showToast('Error de conexión', 'error');
    });
}

function eliminarUsuario(id) {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
        // Implementar API de eliminación si es necesario
        showToast('Funcionalidad de eliminación pendiente de implementar', 'info');
    }
}
