const formulario = document.getElementById('ingreso-pasajero');
const tabla = document.getElementById('tabla');
let ciudad = [];
let ciudadDelugares = [];

const obtenerLugares = async () => {
    const response = await fetch('./lugares.json');
    const data = await response.json();

    ciudadDelugares = data;

    document.getElementById('destino').innerHTML = data
    .map(({ id, destino }) => `<option value="${id}">${destino}</option>`)
    .join();
}

obtenerLugares();

const llamadaAlServidor = new Promise((resolve, reject) => {
    setTimeout(() => {
        const ciudadDelLocalStorage = JSON.parse(localStorage.getItem('pasajeros')) || [];
        const storageCiudad = ciudadDelLocalStorage.map((pasajero) => {
            return new Pasajero(pasajero);
});

        ciudad = storageCiudad;

        resolve(storageCiudad);
    }, 2000);
});

const agregarFilaALaTabla = ({ nombre, apellido, edad, destino, dni }) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${nombre}</td>
        <td>${apellido}</td>
        <td>${edad}</td>
        <td>${ciudadDelugares.find(destinoDePasajero => destinoDePasajero.id === destino)?.destino}</td>
        <td>${dni}</td>
    `;
    
    const botonera = document.createElement('td');
    botonera.innerHTML = '<button class="btn btn-danger mb-3">ELIMINAR</button>';
    botonera.addEventListener('click', () => {
        Swal.fire({
            text: `Vas a eliminar ${nombre}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No' 
        }).then((respuesta) => {
            if(respuesta.isConfirmed) {
                const pasajeroEncontrado = ciudad.find((elemento) => elemento.nombre === nombre);
                const indice = ciudad.indexOf(pasajeroEncontrado);
                ciudad.splice(indice, 1);
                localStorage.setItem('ciudad', JSON.stringify(ciudad));
                tr.remove();
            } 
        });
    });

    tr.append(botonera);

    tabla.append(tr);
}

const mensajeEspera = document.getElementById('mensaje-espera');
mensajeEspera.hidden = false;

llamadaAlServidor.then((data) => {
    for(const pasajero of data) {
        agregarFilaALaTabla(pasajero);
    }
    mensajeEspera.hidden = true;
    tabla.hidden = false;
}).catch(() => {
    toastify({
        text: 'Ocurrio un error, reintente mas tarde',
        gravity: 'top',
        position: 'right',
        duration: 5000,
        style: {
            background: 'yellow'
        },
        close: true
    }).showToast();});

formulario.addEventListener('submit', (e) => {
    e.preventDefault();

    const[nombreInput, apellidoInput, edadInput, destinoInput, dniInput] = e.target;
    const pasajero = new Pasajero({
        nombre: nombreInput.value,
        apellido: apellidoInput.value,
        edad: edadInput.value,
        destino: destinoInput.value,
        dni: dniInput.value,
    });
    
    if (!pasajero.soyMayorDeEdad()) {
        Toastify({
            text:'Tienes que ser mayor de 18 años o traer una autorizacion ante escribano publico',
            gravity: 'top',
        position: 'right',
        duration: 5000,
        style: {
            background: 'yellow'
        },
        close: true
        }).showToast();
    return;
    }

    ciudad.push(pasajero);
    localStorage.setItem('ciudad', JSON.stringify(ciudad));

    agregarFilaALaTabla(pasajero);

    for(const input of e.target) {
    input.value = '';
    }
});