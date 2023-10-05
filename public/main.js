let currentId = null;

document.getElementById('userForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const email = document.getElementById('email').value;
    const fecha = document.getElementById('fecha').value;

    if (!nombre.match(/^[a-záéíóúñü]+$/i)) {
        alert('El nombre solo puede contener caracteres alfabéticos en español y no puede estar vacío.');
        return;
    }

    if (!apellido.match(/^[a-záéíóúñü]+$/i)) {
        alert('El apellido solo puede contener caracteres alfabéticos en español y no puede estar vacío.');
        return;
    }

    if (!email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
        alert('El email debe ser una dirección de correo válida y no puede estar vacío.');
        return;
    }

    if (!fecha) {
        alert('La fecha de nacimiento es obligatoria.');
        return;
    }

    if (currentId) {
        fetch(`https://base-de-datos-jc-default-rtdb.firebaseio.com/usuarios/${currentId}.json`, {
            method: 'PUT',
            body: JSON.stringify({
                nombre: nombre,
                apellido: apellido,
                email: email,
                fecha: fecha
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            document.getElementById(currentId).remove();
            addUsuarioToTable(currentId, data.nombre, data.apellido, data.email, data.fecha);

            event.target.reset();
            currentId = null;
        });
    } else {
        fetch('https://base-de-datos-jc-default-rtdb.firebaseio.com/usuarios.json', {
            method: 'POST',
            body: JSON.stringify({
                nombre: nombre,
                apellido: apellido,
                email: email,
                fecha: fecha
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            addUsuarioToTable(data.name, nombre, apellido, email, fecha);

            event.target.reset();
        });
    }
});

function addUsuarioToTable(id, nombre, apellido, email, fecha) {
    const usuario = document.createElement('tr');
    usuario.id = id;

    const idCell = document.createElement('td');
    idCell.textContent = id;

    const nombreCell = document.createElement('td');
    nombreCell.textContent = nombre;

    const apellidoCell = document.createElement('td');
    apellidoCell.textContent = apellido;

    const emailCell = document.createElement('td');
    emailCell.textContent = email;

    const fechaCell = document.createElement('td');
    fechaCell.textContent = fecha;

    const accionesCell = document.createElement('td');

    const actualizarButton = document.createElement('button');
    actualizarButton.textContent = 'Actualizar';
    actualizarButton.addEventListener('click', function () {
        document.getElementById('nombre').value = nombre;
        document.getElementById('apellido').value = apellido;
        document.getElementById('email').value = email;
        document.getElementById('fecha').value = fecha;
        currentId = id;
    });
    accionesCell.appendChild(actualizarButton);

    const eliminarButton = document.createElement('button');
    eliminarButton.textContent = 'Eliminar';
    eliminarButton.addEventListener('click', function () {
        fetch(`https://base-de-datos-jc-default-rtdb.firebaseio.com/usuarios/${id}.json`, {
            method: 'DELETE'
        }).then(function () {
            document.getElementById('usuarios').removeChild(usuario);
        });
    });
    accionesCell.appendChild(eliminarButton);

    usuario.appendChild(idCell);
    usuario.appendChild(nombreCell);
    usuario.appendChild(apellidoCell);
    usuario.appendChild(emailCell);
    usuario.appendChild(fechaCell);
    usuario.appendChild(accionesCell);

    document.getElementById('usuarios').appendChild(usuario);
}

window.addEventListener('load', function () {
    fetch('https://base-de-datos-jc-default-rtdb.firebaseio.com/usuarios.json')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            for (let id in data) {
                addUsuarioToTable(id, data[id].nombre, data[id].apellido, data[id].email, data[id].fecha);
            }
        });
});


