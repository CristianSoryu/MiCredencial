// admin-api.js - Simulaciones de APIs externas

async function checkBiblioteca(userId) {
    // Simular verificación de retrasos en biblioteca
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simular que algunos usuarios tienen retrasos
            const hasDelays = Math.random() > 0.7;
            resolve(hasDelays ? 'retrasos en biblioteca' : 'aprobado');
        }, 500);
    });
}

async function checkBienestar(userId) {
    // Simular verificación de sanciones
    return new Promise((resolve) => {
        setTimeout(() => {
            const hasSanctions = Math.random() > 0.8;
            resolve(hasSanctions ? 'sanciones activas' : 'aprobado');
        }, 500);
    });
}

async function checkTI(userId) {
    // Simular verificación de equipos pendientes
    return new Promise((resolve) => {
        setTimeout(() => {
            const hasPending = Math.random() > 0.6;
            resolve(hasPending ? 'equipos pendientes' : 'aprobado');
        }, 500);
    });
}