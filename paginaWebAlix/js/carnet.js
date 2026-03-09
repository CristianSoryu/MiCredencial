//Todo lo relacionado con mostrar el carnet digital.
function mostrarCarnet(user){

document.getElementById('carnet-nombre').textContent = user.nombre;

document.getElementById('carnet-id').textContent = user.identificacion;

document.getElementById('carnet-programa').textContent = user.programa;

document.getElementById('carnet-vencimiento').textContent = user.vencimiento;

new QRCode(document.getElementById('qrcode'),{

text: JSON.stringify(user),

width:160,

height:160

});

showView('carnet');

}

function logout(){

localStorage.removeItem("carnet");

currentUser = null;

showView("login");

}