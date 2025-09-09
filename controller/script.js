const API_URL = "https://script.google.com/macros/s/AKfycbxBk8ZWUlTBKbXm9AqwQmL-aARY1jC2jbSnqNprF6UP9q46BY2dH5XkEKApxiSr81fQRQ/exec"; // Reemplaza con tu WebApp

let catalogo = [];
let inventario = [];

// Cargar catálogo
function cargarCatalogo() {
  fetch(API_URL + "?action=getCatalogo")
    .then(r => r.json())
    .then(data => {
      catalogo = data;
      const tbody = document.getElementById('tablaCatalogo');
      tbody.innerHTML = '';
      catalogo.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${item[0]}</td><td>${item[1]}</td>`;
        tbody.appendChild(tr);
      });
    });
}

// Cargar inventario
function cargarInventario() {
  fetch(API_URL + "?action=getInventario")
    .then(r => r.json())
    .then(data => {
      inventario = data;
      const tbody = document.getElementById('tablaInventario');
      tbody.innerHTML = '';
      inventario.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${item[0]}</td>
          <td>${item[1]}</td>
          <td>${item[2]}</td>
          <td>
            <button class="fa fa-pen" onclick="editarProducto('${item[0]}')"><p class="editar"> Editar</p></button>
            <button class="fa fa-trash" onclick="eliminarProducto('${item[0]}')"><p class="eliminar"> Eliminar</p></button>
          </td>`;
        tbody.appendChild(tr);
      });
    });
}



// Autocompletar descripción
document.getElementById('codigo').addEventListener('blur', () => {
  const codigo = document.getElementById('codigo').value.trim();
  const item = catalogo.find(x => x[0] === codigo);
  if (item) document.getElementById('descripcion').value = item[1];
});

// Guardar producto
document.getElementById('formProducto').addEventListener('submit', e => {
  e.preventDefault();
  const data = {
    action: "guardar",
    codigo: document.getElementById('codigo').value.trim(),
    descripcion: document.getElementById('descripcion').value.trim(),
    cantidad: document.getElementById('cantidad').value
  };
  fetch(API_URL, { method: "POST", body: JSON.stringify(data) })
    .then(r => r.json())
    .then(() => {
      alert("¡Producto guardado exitosamente!");
      document.getElementById('formProducto').reset();
      cargarInventario();
    })
    .catch(error => {
      console.error('Error al guardar:', error);
      alert("Hubo un error al guardar el producto.");
    });
});

// Editar producto
function editarProducto(codigo) {
  const item = inventario.find(x => x[0] === codigo);
  if (item) {
    document.getElementById('codigo').value = item[0];
    document.getElementById('descripcion').value = item[1];
    document.getElementById('cantidad').value = item[2];
  }
}

// Eliminar producto
function eliminarProducto(codigo) {
  if (confirm('¿Eliminar este producto?')) {
    const data = {
      action: "eliminar",
      codigo: codigo
    };
    fetch(API_URL, { method: "POST", body: JSON.stringify(data) })
      .then(r => r.json())
      .then(() => {
        alert("¡Producto eliminado exitosamente!");
        cargarInventario();
      })
      .catch(error => {
        console.error('Error al eliminar:', error);
        alert("Hubo un error al eliminar el producto.");
      });
  }
}
