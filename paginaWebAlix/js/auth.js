//Lógica de inicio de sesión y logout.
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login-form').addEventListener('submit', (e)=>{

    e.preventDefault();

    const identificador = document.getElementById('login-id').value;
    const contrasena = document.getElementById('login-password').value;

    // para la demostración, cualquier identificador y contraseña serán aceptados. En producción, aquí se haría una llamada a la API para validar las credenciales.
     
    
    if (identificador && contrasena) {
        // Calcular fecha de vencimiento (1 año desde hoy)
        const fechaActual = new Date();
        const fechaVencimiento = new Date(fechaActual.getFullYear() + 1, fechaActual.getMonth(), fechaActual.getDate());
        const vencimientoFormato = fechaVencimiento.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });

        const dummyUser = {
        nombre: "Juan Ruiz",
        identificacion: "123456",
        programa: "Ing en TIC",
        vencimiento: vencimientoFormato,
        };

        currentUser = dummyUser;
        localStorage.setItem('carnet', JSON.stringify(currentUser));
        alert('Login exitoso! Redirigiendo al carnet...');
        window.location.href = 'carnet.html';
    } else {
        alert('Por favor ingrese credenciales válidas.');
    }

    });
});