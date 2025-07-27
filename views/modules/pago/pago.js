// Opciones dependientes de grado según nivel
const nivelSelect = document.getElementById('nivel-select');
const gradoSelect = document.getElementById('grado-select');
const gradoOpciones = {
    Basico: ['A1', 'A2'],
    Intermedio: ['B1', 'B2'],
    Avanzado: ['C1', 'C2']
};

nivelSelect.addEventListener('change', function() {
    const nivel = nivelSelect.value;
    gradoSelect.innerHTML = '<option value="">Selecciona grado</option>';
    if (gradoOpciones[nivel]) {
        gradoOpciones[nivel].forEach(g => {
            gradoSelect.innerHTML += `<option value="${g}">${g}</option>`;
        });
    }
});

// Referencia al formulario de pago
const formPago = document.getElementById('form-pago');
// Variable para almacenar el ID del pago que se está editando
let currentEditId = null;

// Función para reiniciar el formulario y el estado de edición
function resetFormAndModal() {
    formPago.reset();
    document.getElementById('modal-pago').style.display = 'none';
    currentEditId = null; // Reiniciar el ID de edición
    // Asegurarse de que el botón de envío vuelva a la función de agregar
    formPago.removeEventListener('submit', handleEditSubmit); // Remover el listener de edición si existe
    formPago.addEventListener('submit', handleAddSubmit); // Añadir el listener de agregar
}

// Handler para el envío del formulario al AÑADIR un nuevo pago
async function handleAddSubmit(e) {
    e.preventDefault();
    const pago = {
        estudiante: formPago.estudiante.value,
        nivel: formPago.nivel.value,
        grado: formPago.grado.value,
        modulo: Number(formPago.modulo.value),
        monto: Number(formPago.monto.value),
        fecha: formPago.fecha.value,
        estado: formPago.estado.value
    };
    try {
        const res = await fetch('/api/pagos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pago)
        });
        if (res.ok) {
            resetFormAndModal(); // Usar la función de reinicio
            cargarPagos(); // Recarga la tabla
        } else {
            const error = await res.json();
            alert('Error: ' + (error.error || 'No se pudo guardar el pago'));
        }
    } catch (err) {
        alert('Error de conexión');
    }
}

// Handler para el envío del formulario al EDITAR un pago existente
async function handleEditSubmit(e) {
    e.preventDefault();
    const pagoEditado = {
        estudiante: formPago.estudiante.value,
        nivel: formPago.nivel.value,
        grado: formPago.grado.value,
        modulo: Number(formPago.modulo.value),
        monto: Number(formPago.monto.value),
        fecha: formPago.fecha.value,
        estado: formPago.estado.value
    };
    try {
        const res = await fetch('/api/pagos/' + currentEditId, { // Usar currentEditId
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pagoEditado)
        });
        if (res.ok) {
            resetFormAndModal(); // Usar la función de reinicio
            cargarPagos();
        } else {
            const error = await res.json();
            alert('Error: ' + (error.error || 'No se pudo actualizar el pago'));
        }
    } catch (err) {
        alert('Error de conexión');
    }
}

// Mostrar el modal y configurar el formulario para añadir un nuevo pago
document.getElementById('add-payment').addEventListener('click', function() {
    formPago.reset(); // Asegurarse de que el formulario esté limpio
    currentEditId = null; // No hay ID de edición al añadir
    formPago.removeEventListener('submit', handleEditSubmit); // Asegurarse de que no esté el listener de edición
    formPago.addEventListener('submit', handleAddSubmit); // Establecer el listener para añadir
    document.getElementById('modal-pago').style.display = 'flex';
});

// Cerrar el modal
document.getElementById('close-modal').addEventListener('click', function() {
    resetFormAndModal(); // Usar la función de reinicio
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
        try {
            const res = await fetch('/api/pagos/' + id, { method: 'DELETE' });
            if (res.ok) {
                cargarPagos();
            } else {
                const error = await res.json();
                alert('Error al eliminar: ' + (error.error || 'No se pudo eliminar el pago'));
            }
        } catch (err) {
            alert('Error de conexión');
        }
    }
}

// Editar pago
window.editarPago = async function(id) {
    // Almacenar el ID del pago que se está editando
    currentEditId = id;

    // Obtener datos del pago específico para editar
    try {
        const res = await fetch('/api/pagos'); // Obtener todos los pagos y buscar
        const pagos = await res.json();
        const pago = pagos.find(p => p._id === id);

        if (!pago) {
            return alert('Pago no encontrado');
        }

        // Mostrar modal y rellenar datos
        document.getElementById('modal-pago').style.display = 'flex';

        formPago.estudiante.value = pago.estudiante;
        nivelSelect.value = pago.nivel;
        nivelSelect.dispatchEvent(new Event('change')); // Disparar el cambio para actualizar grados
        // Es posible que necesitemos un pequeño retraso o Promise.resolve para asegurar que gradoSelect esté poblado
        // antes de intentar establecer su valor si el DOM no se actualiza instantáneamente.
        // En la mayoría de los casos síncronos, esto debería funcionar.
        setTimeout(() => { // Pequeño retraso para asegurar que los grados se carguen
            gradoSelect.value = pago.grado;
        }, 0);

        formPago.modulo.value = pago.modulo;
        formPago.monto.value = pago.monto;
        formPago.fecha.value = pago.fecha.slice(0, 10);
        formPago.estado.value = pago.estado;

        // Remover el listener de "añadir" y añadir el listener de "editar"
        formPago.removeEventListener('submit', handleAddSubmit);
        formPago.addEventListener('submit', handleEditSubmit);

    } catch (err) {
        alert('Error de conexión al obtener datos del pago');
    }
}

// Inicializar el evento submit del formulario para "añadir" por defecto
document.addEventListener('DOMContentLoaded', () => {
    formPago.addEventListener('submit', handleAddSubmit);
});
