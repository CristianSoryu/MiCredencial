//Lógica de inicio de sesión y logout.
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login-form').addEventListener('submit', (e)=>{

    e.preventDefault();

    const identificador = document.getElementById('login-id').value;
    const contrasena = document.getElementById('login-password').value;

    // para la demostración, cualquier identificador y contraseña serán aceptados. En producción, aquí se haría una llamada a la API para validar las credenciales.
     
    
    if (identificador && contrasena) {
        const dummyUser = {
        nombre: "Juan Ruiz",
        identificacion: "123456",
        programa: "Ing en TIC",
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