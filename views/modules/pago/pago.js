// Opciones dependientes de grado según nivel
const nivelSelect = document.getElementById('nivel-select');
const gradoSelect = document.getElementById('grado-select');
const gradoOpciones = {
    Basico: ['A1', 'A2'],
    Intermedio: ['B1', 'B2'],
    Avanzado: ['C1', 'C2']
};
let pagoEnEdicionId = null; // Variable para almacenar el ID del pago que se está editando

nivelSelect.addEventListener('change', function() {
    const nivel = nivelSelect.value;
    gradoSelect.innerHTML = '<option value="">Selecciona grado</option>';
    if (gradoOpciones[nivel]) {
        gradoOpciones[nivel].forEach(g => {
            gradoSelect.innerHTML += `<option value="${g}">${g}</option>`;
        });
    }
});

// Mostrar el modal
document.getElementById('add-payment').addEventListener('click', function() {
    pagoEnEdicionId = null; // Reseteamos el ID cuando se va a crear un nuevo pago
    const form = document.getElementById('form-pago');
    form.reset();
    document.getElementById('modal-pago').style.display = 'flex';
});

// Cerrar el modal
document.getElementById('close-modal').addEventListener('click', function() {
    document.getElementById('modal-pago').style.display = 'none';
});

// Enviar el formulario (maneja tanto la creación como la edición)
document.getElementById('form-pago').addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = e.target;
    const pago = {
        estudiante: form.estudiante.value,
        nivel: form.nivel.value,
        grado: form.grado.value,
        modulo: Number(form.modulo.value),
        monto: Number(form.monto.value),
        fecha: form.fecha.value,
        estado: form.estado.value
    };

    let method = 'POST';
    let url = '/api/pagos';

    if (pagoEnEdicionId) {
        // Si hay un ID, es una edición
        method = 'PUT';
        url = `/api/pagos/${pagoEnEdicionId}`;
    }

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pago)
        });

        if (res.ok) {
            document.getElementById('modal-pago').style.display = 'none';
            form.reset();
            cargarPagos(); // Recarga la tabla
        } else {
            const error = await res.json();
            alert('Error: ' + (error.error || 'No se pudo guardar el pago'));
        }
    } catch (err) {
        alert('Error de conexión');
    }
});

// Mostrar los pagos en la tabla
async function cargarPagos() {
    try {
        const res = await fetch('/api/pagos');
        const data = await res.json();
        if (Array.isArray(data)) {
            const tbody = document.querySelector('tbody');
            tbody.innerHTML = '';
            data.forEach((pago, idx) => {
                tbody.innerHTML += `
                    <tr>
                        <td>${idx + 1}</td>
                        <td>${pago.estudiante}</td>
                        <td>${pago.nivel}</td>
                        <td>${pago.grado}</td>
                        <td>${pago.modulo}</td>
                        <td>$${pago.monto.toFixed(2)}</td>
                        <td>${new Date(pago.fecha).toLocaleDateString()}</td>
                        <td><span class="status ${pago.estado === 'Completado' ? 'completed' : ''}">${pago.estado}</span></td>
                        <td>
                            <button class="btn-icon" onclick="editarPago('${pago._id}')"><i class="fas fa-edit" id="edit"></i></button>
                            <button class="btn-icon danger" onclick="eliminarPago('${pago._id}')"><i class="fas fa-trash" id="delete"></i></button>
                        </td>
                    </tr>
                `;
            });
        } else {
            alert('Error al cargar pagos: ' + (data.error || 'Respuesta inesperada'));
        }
    } catch (err) {
        alert('Error de conexión con el servidor');
    }
}
// Cargar pagos al iniciar
document.addEventListener('DOMContentLoaded', cargarPagos);

// Eliminar pago
window.eliminarPago = async function(id) {
    if (confirm('¿Seguro que deseas eliminar este pago?')) {
        await fetch('/api/pagos/' + id, { method: 'DELETE' });
        cargarPagos();
    }
}

// Editar pago
window.editarPago = async function(id) {
    // Almacenar el ID del pago que se va a editar
    pagoEnEdicionId = id;
    const res = await fetch('/api/pagos');
    const pagos = await res.json();
    const pago = pagos.find(p => p._id === id);
    if (!pago) return alert('Pago no encontrado');
    document.getElementById('modal-pago').style.display = 'flex';
    const form = document.getElementById('form-pago');
    form.estudiante.value = pago.estudiante;
    nivelSelect.value = pago.nivel;
    nivelSelect.dispatchEvent(new Event('change'));
    // Esperar un momento para que se rendericen los grados
    setTimeout(() => {
        gradoSelect.value = pago.grado;
    }, 100);
    form.modulo.value = pago.modulo;
    form.monto.value = pago.monto;
    form.fecha.value = pago.fecha.slice(0, 10);
    form.estado.value = pago.estado;
}