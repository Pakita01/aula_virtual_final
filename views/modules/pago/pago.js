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

    // Mostrar el modal
    document.getElementById('add-payment').addEventListener('click', function() {
        document.getElementById('modal-pago').style.display = 'flex';
    });
    // Cerrar el modal
    document.getElementById('close-modal').addEventListener('click', function() {
        document.getElementById('modal-pago').style.display = 'none';
    });
    // Enviar el formulario
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
        try {
            const res = await fetch('/api/pagos', {
                method: 'POST',
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
        // Obtener datos del pago
        const res = await fetch('/api/pagos');
        const pagos = await res.json();
        const pago = pagos.find(p => p._id === id);
        if (!pago) return alert('Pago no encontrado');
        // Mostrar modal y rellenar datos
        document.getElementById('modal-pago').style.display = 'flex';
        const form = document.getElementById('form-pago');
        form.estudiante.value = pago.estudiante;
        //form.curso.value = pago.curso;
        
        // Disparar el cambio para actualizar grados
        nivelSelect.value = pago.nivel;
        nivelSelect.dispatchEvent(new Event('change'));
        gradoSelect.value = pago.grado;
        form.modulo.value = pago.modulo;
        form.monto.value = pago.monto;
        form.fecha.value = pago.fecha.slice(0,10);
        form.estado.value = pago.estado;
        // Guardar el submit original para modo crear solo una vez
        if (!window.defaultSubmit) {
            window.defaultSubmit = function(e) {
                e.preventDefault();
                const pago = {
                    estudiante: form.estudiante.value,
                    nivel: form.nivel.value,
                    grado: form.grado.value,
                    modulo: Number(form.modulo.value),
                    monto: Number(form.monto.value),
                    fecha: form.fecha.value,
                    estado: form.estado.value
                };
                fetch('/api/pagos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(pago)
                }).then(res => {
                    if (res.ok) {
                        document.getElementById('modal-pago').style.display = 'none';
                        form.reset();
                        cargarPagos();
                    } else {
                        res.json().then(error => {
                            alert('Error: ' + (error.error || 'No se pudo guardar el pago'));
                        });
                    }
                }).catch(() => alert('Error de conexión'));
            };
        }
        // Cambiar el submit para actualizar
        form.onsubmit = async function(e) {
            e.preventDefault();
            const pagoEditado = {
                estudiante: form.estudiante.value,
                nivel: form.nivel.value,
                grado: form.grado.value,
                modulo: Number(form.modulo.value),
                monto: Number(form.monto.value),
                fecha: form.fecha.value,
                estado: form.estado.value
            };
            try {
                const res = await fetch('/api/pagos/' + id, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(pagoEditado)
                });
                if (res.ok) {
                    document.getElementById('modal-pago').style.display = 'none';
                    form.reset();
                    form.onsubmit = window.defaultSubmit;
                    cargarPagos();
                } else {
                    const error = await res.json();
                    alert('Error: ' + (error.error || 'No se pudo actualizar el pago'));
                }
            } catch (err) {
                alert('Error de conexión');
            }
        }
    }