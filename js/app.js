//Variables
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
const contentMesange = document.querySelector('.content-message');


let tareas = [];

document.addEventListener('DOMContentLoaded', () => {
    formulario.addEventListener('submit', agregarTarea);

    tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    mostrarHtml();
});


//funciones
function agregarTarea(e){
    e.preventDefault();
    
    const tarea = document.querySelector('.add-task').value;
    
    if(tarea === ''){
        mostrarMensaje('El campo no debe estar vacío');
        return;
    }

    const tareaObj = {
        tarea,
        id: Date.now()
    }

    tareas = [...tareas, tareaObj]
    
    mostrarHtml();

    formulario.reset();
}

let mensajeMostrado = false;

function mostrarMensaje(mensaje){

    if(mensajeMostrado){
        return false;
    }

    mensajeMostrado = true;
    const divMensaje = document.createElement('div');
    divMensaje.classList.add('error');

    divMensaje.textContent = mensaje;

    contentMesange.appendChild(divMensaje);

    setTimeout(() => {
        divMensaje.remove();
        mensajeMostrado = false;
    }, 3000);
}

function mostrarHtml(){

    limpiarHTML();

    if(tareas.length > 0){
        tareas.forEach(tarea => {

            const btnEliminar = document.createElement('a');
            btnEliminar.classList.add('borrar-tarea');
            btnEliminar.innerHTML = '<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-xbox-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 21a9 9 0 0 0 9 -9a9 9 0 0 0 -9 -9a9 9 0 0 0 -9 9a9 9 0 0 0 9 9z" /><path d="M9 8l6 8" /><path d="M15 8l-6 8" /></svg>';

            btnEliminar.onclick = () => {
                eliminarTarea(tarea.id);
            }
            const li = document.createElement('li');
            li.textContent = tarea.tarea;

            li.appendChild(btnEliminar)

            resultado.appendChild(li)
        });
    }

    sincronizarLocalStorage();
}

function sincronizarLocalStorage(){
    localStorage.setItem('tareas', JSON.stringify(tareas))
}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function eliminarTarea(id){
    tareas = tareas.filter( tarea => tarea.id !== id);

    mostrarHtml();
}