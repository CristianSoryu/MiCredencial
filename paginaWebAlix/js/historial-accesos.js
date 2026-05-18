document.addEventListener('DOMContentLoaded', () => {
    // 1. Verificar autorización (rol de escaneador)
    fetch('../api/carnet/get_carnet.php')
        .then(response => response.json())
        .then(data => {
            const roles = data.usuario?.todos_los_roles || [];
            if (!data.success || !roles.includes('escaneador')) {
                showToast("Acceso no autorizado. Se requiere rol de escaneador.", "error");
                setTimeout(() => window.location.href = 'index.html', 1500);
                return;
            }
            
            // 2. Si tiene permisos, cargar el historial inicial
            cargarHistorial();
        })
        .catch(error => {
            console.error("Error de autorización:", error);
            window.location.href = 'index.html';
        });
});

async function cargarHistorial(filtros = {}) {
    const tbody = document.getElementById('tabla-historial');
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Cargando historial...</td></tr>';

    try {
        // Construir URL con parámetros
        const url = new URL(window.location.origin + '/MiCredencial/paginaWebAlix/api/escaner/get_historial.php');
        Object.keys(filtros).forEach(key => {
            if (filtros[key]) {
                url.searchParams.append(key, filtros[key]);
            }
        });

        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
            renderizarTabla(data.historial);
        } else {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: red;">Error: ${data.message}</td></tr>`;
        }
    } catch (error) {
        console.error('Error al cargar historial:', error);
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: red;">Error de conexión con el servidor.</td></tr>`;
    }
}

function renderizarTabla(historial) {
    const tbody = document.getElementById('tabla-historial');
    tbody.innerHTML = '';

    if (historial.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No se encontraron registros.</td></tr>';
        return;
    }

    historial.forEach(reg => {
        const tr = document.createElement('tr');
        
        // Formatear fecha
        const fecha = new Date(reg.fecha_registro).toLocaleString('es-CO');
        
        // Formatear tipo con su clase CSS
        const claseEstado = reg.tipo === 'entrada' ? 'estado-entrada' : 'estado-salida';
        const tipoBadge = `<span class="${claseEstado}">${reg.tipo.toUpperCase()}</span>`;
        
        // Formatear método (primera letra mayúscula)
        const metodoTexto = reg.metodo.charAt(0).toUpperCase() + reg.metodo.slice(1);
        
        tr.innerHTML = `
            <td>${fecha}</td>
            <td>${reg.id_usuario}</td>
            <td>${reg.nombres} ${reg.apellidos}</td>
            <td>${tipoBadge}</td>
            <td>${metodoTexto}</td>
        `;
        
        tbody.appendChild(tr);
    });
}

function aplicarFiltros() {
    const filtros = {
        fecha: document.getElementById('filtro-fecha').value,
        documento: document.getElementById('filtro-documento').value.trim(),
        metodo: document.getElementById('filtro-metodo').value,
        tipo: document.getElementById('filtro-tipo').value
    };
    
    cargarHistorial(filtros);
}

function limpiarFiltros() {
    document.getElementById('filtro-fecha').value = '';
    document.getElementById('filtro-documento').value = '';
    document.getElementById('filtro-metodo').value = '';
    document.getElementById('filtro-tipo').value = '';
    
    cargarHistorial();
}
