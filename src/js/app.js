//selectores
const day = document.querySelector('#day');
const hours = document.querySelector('#hours');
const formulario = document.querySelector('#formulario');
const tasksContainer = document.querySelector('#resultado');
const submitForm = document.querySelector('#formulario input[type="submit"]');


//Variables
let tasks = [];
let taskId = null;
let editando = false;
const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Agos', 'Sep', 'Oct', 'Nov', 'Dic']
const dias = ['Lunes', 'Marte', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];

const fechaActual = new Date();

const mes = fechaActual.getMonth();
const diaSemana = fechaActual.getDay();
const diaDelMes = fechaActual.getDate();
const year = fechaActual.getFullYear();

const mesActual = meses[mes];
const diaActual = dias[diaSemana];

day.innerHTML = `${diaActual} ${diaDelMes} ${mesActual} ${year}`

// addEventListener

document.addEventListener('DOMContentLoaded', () => {
    formulario.addEventListener('submit', agregarTarea);

    tasks = JSON.parse(localStorage.getItem('tareas')) || [];

    mostrarTarea();
})


function agregarTarea(e){
    e.preventDefault();
    const task = document.querySelector('#task').value;
    const time = document.querySelector('#time').value;

    if(task === '' || time === ''){
        mostrarMensaje('Los campos son obligatorios', 'error');
        return;
    }

    if (editando) {
        const taskActualizado = { task, time, id: taskId };
        editar(taskActualizado);
        mostrarMensaje('Tarea editada correctamente');
    } else {
        const taskObj = {
            task,
            time,
            id: Date.now()
        };
        tasks = [...tasks, taskObj];
        mostrarMensaje('Tarea agregada correctamente');

        const spinner = document.querySelector('#cargando');
        spinner.style.display = 'block';

        setTimeout(() => {
            mostrarTarea();
            spinner.style.display = 'none'
        }, 1500);
    }
    
    editando = false;
    formulario.reset();
    submitForm.value = 'Agregar';
}

function mostrarTarea(){
    while(tasksContainer.firstChild){
        tasksContainer.removeChild(tasksContainer.firstChild)
    }
    
    if(tasks.length === 0){
        tasksContainer.innerHTML = ' <p class="text-center text-[#8ea6c8] font-semibold">Agrega una tarea</p>';
    }

    tasks.forEach(task => {
        const divTask = document.createElement('div');
        divTask.classList.add('bg-[#e0ebff]', 'text-[#063c76]', 'font-semibold', 'py-2', 'px-2', 'rounded-md', 'flex', 'justify-between');
        
        const parraTask = document.createElement('P');
        parraTask.classList.add('max-sm:text-[0.85rem]')
        parraTask.textContent = task.task;

        const divTime = document.createElement('DIV');
        divTime.classList.add('icons', 'flex', 'justify-center', 'items-center', 'gap-3');

        divTime.innerHTML = `<p class="max-sm:text-[0.85rem]">${task.time}</p>`;
        
        const divBtn = document.createElement('DIV');
        divBtn.classList.add('flex');

        const btnEditar = document.createElement('button');
        btnEditar.innerHTML = '<svg class="max-sm:w-5" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-pencil"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" /><path d="M13.5 6.5l4 4" /></svg>';
        
        const clone = structuredClone(task)
        btnEditar.onclick = () => {
            cargarEdicion(clone);
        }

        const btnEliminar = document.createElement('button');
        btnEliminar.innerHTML = '<svg class="text-red-700 max-sm:w-5" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>';

        btnEliminar.onclick = () => {
            eliminarTarea(task.id)
        }

        divBtn.appendChild(btnEditar);
        divBtn.appendChild(btnEliminar);

        divTime.appendChild(divBtn);

        divTask.appendChild(parraTask);
        divTask.appendChild(divTime);

        tasksContainer.appendChild(divTask)
    });

    agregarLocalStorage();
}

function agregarLocalStorage(){
    localStorage.setItem('tareas', JSON.stringify(tasks))
}

function editar(taskActualizado){
    tasks = tasks.map(task => task.id === taskActualizado.id ? taskActualizado : task);
    mostrarTarea();
}
function eliminarTarea(id){
    tasks = tasks.filter( task => task.id !== id);
    mostrarTarea();
}

function cargarEdicion(taskClone){
    taskId = taskClone.id; // Guardar el id de la tarea que se está editando

    const task = document.querySelector('#task');
    const time = document.querySelector('#time');

    task.value = taskClone.task;
    time.value = taskClone.time;

    editando = true;
    submitForm.value = 'Editar';
}

function mostrarMensaje(mensaje, tipo){
    const divMensaje = document.createElement('DIV');
    divMensaje.classList.add('rounded', 'text-center', 'text-white', 'uppercase', 'mb-2', 'font-semibold', 'text-[.9rem]', 'py-1', 'alerta', 'max-sm:text-[.75rem]');

    const existe = document.querySelector('.alerta');
    existe?.remove();

    if(tipo === 'error'){
        divMensaje.classList.add('bg-red-600')
    }else{
        divMensaje.classList.add('bg-green-600')
    }

    divMensaje.textContent = mensaje;

    formulario.parentElement.insertBefore(divMensaje, formulario);

    setTimeout(() => {
        divMensaje.remove();
    }, 1500);
}


function horaActual(){
    const horaActual = new Date();
    let hora = horaActual.getHours();
    let minutos = horaActual.getMinutes();
    let segundos = horaActual.getSeconds();
   
    minutos = minutos < 10 ? `0${minutos}` : minutos;
    segundos = segundos < 10 ? `0${segundos}` : segundos;

    const periodo = hora >= 12 ? 'PM' : 'AM';

    hora = hora % 12 || 12;
    
    hours.innerHTML = `${hora}:${minutos}:${segundos}${periodo}`
}
setInterval(horaActual, 1000);

