document.addEventListener('DOMContentLoaded', () => {
    const dataForm = document.getElementById('dataForm');
    const dataTableBody = document.getElementById('dataTableBody');
    const saveButton = document.querySelector('.btn-primary');

    // Función para cargar datos desde localStorage
    function loadData() {
        const jsonData = localStorage.getItem('dataRecords');
        return jsonData ? JSON.parse(jsonData) : [];
    }

    // Función para guardar datos en localStorage
    function saveData(data) {
        localStorage.setItem('dataRecords', JSON.stringify(data));
    }

    // Función para renderizar la tabla
    function renderTable() {
        const records = loadData();
        dataTableBody.innerHTML = ''; // Limpiar la tabla antes de renderizar
        if (records.length > 0) {
            records.forEach((record, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${record.nombre}</td>
                    <td>${record.email}</td>
                    <td>${record.ciudad}</td>
                    <td>
                        <button class="btn btn-warning btn-sm edit-btn" data-index="${index}">Editar</button>
                        <button class="btn btn-danger btn-sm delete-btn" data-index="${index}">Eliminar</button>
                    </td>
                `;
                dataTableBody.appendChild(row);
            });
        }

        // Agregar listeners a los botones de eliminar
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', handleDelete);
        });

        // Agregar listeners a los botones de editar
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', handleEdit);
        });
    }

    // Manejar el envío del formulario (para agregar y editar)
    dataForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const ciudad = document.getElementById('ciudad').value;
        const records = loadData();

        const editingIndex = dataForm.dataset.editingIndex;
        if (editingIndex !== undefined) {
            records[editingIndex] = { nombre, email, ciudad };
            delete dataForm.dataset.editingIndex;
            saveButton.textContent = 'Guardar Datos';
        } else {
            const newRecord = { nombre, email, ciudad };
            records.push(newRecord);
        }

        saveData(records);
        dataForm.reset();
        renderTable();
    });

    // Función para manejar el botón de eliminar
    function handleDelete(e) {
        const index = e.target.dataset.index;
        const records = loadData();
        records.splice(index, 1);
        saveData(records);
        renderTable();
    }

    // Función para manejar el botón de editar
    function handleEdit(e) {
        const index = e.target.dataset.index;
        const records = loadData();
        const recordToEdit = records[index];

        document.getElementById('nombre').value = recordToEdit.nombre;
        document.getElementById('email').value = recordToEdit.email;
        document.getElementById('ciudad').value = recordToEdit.ciudad;

        saveButton.textContent = 'Actualizar Datos';
        dataForm.dataset.editingIndex = index;
    }

    // Cargar y mostrar los datos al inicio
    renderTable();
});
