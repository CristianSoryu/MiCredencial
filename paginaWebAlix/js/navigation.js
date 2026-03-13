//esto es para navegar cambiar las paginas y eso
function showView(viewName){

const views = [
'login',
'carnet',
'preregistro',
'recuperar',
'visitantes',
'egresado',
'admin'
];

views.forEach(v=>{
document.getElementById(v + '-view').classList.add('hidden');
});

document.getElementById(viewName + '-view').classList.remove('hidden');

}