document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const dataForm = document.getElementById("dataForm");
  const dataTableBody = document.getElementById("dataTableBody");
  const saveButton = document.querySelector(".btn-primary");


  // ---------------------------
  // MANTENEDOR DE DATOS
  // ---------------------------
  if (dataForm && dataTableBody) {
    // Verificar si el usuario está logueado
    const token = localStorage.getItem("access_token");
    if (!token) {
      window.location.href = "index.html";
      return;
    }

    function loadData() {
      const jsonData = localStorage.getItem("dataRecords");
      return jsonData ? JSON.parse(jsonData) : [];
    }

    function saveData(data) {
      localStorage.setItem("dataRecords", JSON.stringify(data));
    }

    function renderTable() {
      const records = loadData();
      dataTableBody.innerHTML = "";
      if (records.length > 0) {
        records.forEach((record, index) => {
          const row = document.createElement("tr");
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

      document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", handleDelete);
      });

      document.querySelectorAll(".edit-btn").forEach(button => {
        button.addEventListener("click", handleEdit);
      });
    }

    dataForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nombre = document.getElementById("nombre").value;
      const email = document.getElementById("email").value;
      const ciudad = document.getElementById("ciudad").value;
      const records = loadData();

      const editingIndex = dataForm.dataset.editingIndex;
      if (editingIndex !== undefined) {
        records[editingIndex] = { nombre, email, ciudad };
        delete dataForm.dataset.editingIndex;
        saveButton.textContent = "Guardar Datos";
      } else {
        records.push({ nombre, email, ciudad });
      }

      saveData(records);
      dataForm.reset();
      renderTable();
    });

    function handleDelete(e) {
      const index = e.target.dataset.index;
      const records = loadData();
      records.splice(index, 1);
      saveData(records);
      renderTable();
    }

    function handleEdit(e) {
      const index = e.target.dataset.index;
      const records = loadData();
      const recordToEdit = records[index];

      document.getElementById("nombre").value = recordToEdit.nombre;
      document.getElementById("email").value = recordToEdit.email;
      document.getElementById("ciudad").value = recordToEdit.ciudad;

      saveButton.textContent = "Actualizar Datos";
      dataForm.dataset.editingIndex = index;
    }

    renderTable();
  }
});
