document.addEventListener('DOMContentLoaded', () => {
    cargarSolicitudes();
});

async function cargarSolicitudes() {
    try {
        const response = await fetch('../api/admin/get_solicitudes_egresados.php');
        const data = await response.json();

        if (data.success) {
            renderizarTabla(data.solicitudes);
        } else {
            alert('Error: ' + data.message);
            if (data.message === 'No tiene permisos para ver esta sección' || data.message === 'No autorizado') {
                window.location.href = 'admin.html';
            }
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al conectar con el servidor.');
    }
}

function renderizarTabla(solicitudes) {
    const tbody = document.getElementById('tabla-solicitudes');
    tbody.innerHTML = '';

    if (solicitudes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No hay solicitudes pendientes</td></tr>';
        return;
    }

    solicitudes.forEach(sol => {
        if(sol.estado !== 'pendiente') return; // Solo mostrar pendientes

        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${sol.nombres}</td>
            <td>${sol.identificacion}</td>
            <td>${sol.programa_academico}</td>
            <td><span class="estado-${sol.estado}">${sol.estado.toUpperCase()}</span></td>
            <td>
                <button class="btn-aprobar" onclick="actualizarSolicitud(${sol.id}, 'aprobado')">
                    <i class="fas fa-check"></i> Aprobar
                </button>
                <button class="btn-rechazar" onclick="actualizarSolicitud(${sol.id}, 'rechazado')">
                    <i class="fas fa-times"></i> Rechazar
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function actualizarSolicitud(id, estado) {
    if (!confirm(`¿Está seguro de ${estado} esta solicitud?`)) {
        return;
    }

    try {
        const response = await fetch('../api/admin/update_solicitud_egresado.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, estado })
        });

        const data = await response.json();

        if (data.success) {
            alert(data.message);
            cargarSolicitudes(); // Recargar la tabla
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al procesar la solicitud.');
    }
}
