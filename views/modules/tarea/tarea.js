 // JS para la gestión académica
        const formNuevaTarea = document.getElementById('form-nueva-tarea');
        const formAsignarNota = document.getElementById('form-asignar-nota');
        const selectTareaNivel = document.getElementById('tarea-nivel');
        const selectTareaGrado = document.getElementById('tarea-grado');
        const selectNotaTarea = document.getElementById('nota-tarea');
        const selectNotaEstudiante = document.getElementById('nota-estudiante');
        const tareasTbody = document.getElementById('tareas-tbody');

        // Función para cargar las tareas existentes
        async function cargarTareas() {
            try {
                
                const res = await fetch('/api/tareas');
                if (!res.ok) throw new Error('Error al cargar tareas');
                const tareas = await res.json();
                
                tareasTbody.innerHTML = '';
                selectNotaTarea.innerHTML = '<option value="">Seleccione Tarea</option>';
                if (Array.isArray(tareas) && tareas.length > 0) {
                    tareas.forEach(tarea => {
                        tareasTbody.innerHTML += `
                            <tr>
                                <td>${tarea.titulo}</td>
                                <td>${tarea.nivel}</td>
                                <td>${tarea.grado}</td>
                                <td>${new Date(tarea.fecha_entrega).toLocaleDateString()}</td>
                                <td>${tarea.puntos}</td>
                                <td>
                                    <button class="btn-icon" onclick="editarTarea('${tarea._id}')"><i class="fas fa-edit" id="edit"></i></button>
                                    <button class="btn-icon danger" onclick="eliminarTarea('${tarea._id}')"><i class="fas fa-trash" id="delete"></i></button>
                                </td>
                            </tr>
                        `;
                        selectNotaTarea.innerHTML += `<option value="${tarea._id}">${tarea.titulo} (${tarea.nivel}-${tarea.grado})</option>`;
                    });
                } else {
                    tareasTbody.innerHTML = '<tr><td colspan="6">No hay tareas creadas.</td></tr>';
                    selectNotaTarea.innerHTML = '<option value="">No hay tareas disponibles</option>';
                }
            } catch (error) {
                console.error('Error al cargar tareas:', error);
                tareasTbody.innerHTML = '<tr><td colspan="6">Error al cargar tareas.</td></tr>';
                selectNotaTarea.innerHTML = '<option value="">Error al cargar tareas</option>';
            }
        }

        // Función para cargar estudiantes 
        async function cargarEstudiantes() {
            try {
                
                const res = await fetch('/api/users?role=estudiante'); 
                if (!res.ok) throw new Error('Error al cargar estudiantes');
                const estudiantes = await res.json();

                selectNotaEstudiante.innerHTML = '<option value="">Seleccione Estudiante</option>';
                if (Array.isArray(estudiantes) && estudiantes.length > 0) {
                    estudiantes.forEach(estudiante => {
                        selectNotaEstudiante.innerHTML += `<option value="${estudiante._id}">${estudiante.nombre} ${estudiante.apellido}</option>`;
                    });
                } else {
                    selectNotaEstudiante.innerHTML = '<option value="">No hay estudiantes disponibles</option>';
                }
            } catch (error) {
                console.error('Error al cargar estudiantes:', error);
                selectNotaEstudiante.innerHTML = '<option value="">Error al cargar estudiantes</option>';
            }
        }

        // Lógica para el campo "Grado" basado en "Nivel" 
        selectTareaNivel.addEventListener('change', function() {
            const nivel = this.value;
            let grados = [];
            if (nivel === 'Principiante') {
                grados = ['A1', 'A2'];
            } else if (nivel === 'Intermedio') {
                grados = ['B1', 'B2'];
            } else if (nivel === 'Avanzado') {
                grados = ['C1', 'C2'];
            }

            selectTareaGrado.innerHTML = '<option value="">Seleccione Grado</option>';
            grados.forEach(grado => {
                selectTareaGrado.innerHTML += `<option value="${grado}">${grado}</option>`;
            });
            selectTareaGrado.disabled = grados.length === 0;
        });
        selectTareaGrado.disabled = true; // Deshabilitar inicialmente

        // Evento de envío del formulario para NUEVA TAREA
        formNuevaTarea.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(formNuevaTarea);
            const tareaData = Object.fromEntries(formData.entries());

            // Convertir 'puntos' a número
            tareaData.puntos = Number(tareaData.puntos);

            try {
                // Esta URL debe coincidir con tu ruta POST para crear tareas en tareaRoutes.js
                const res = await fetch('/api/tareas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(tareaData)
                });

                if (res.ok) {
                    alert('Tarea creada exitosamente.');
                    formNuevaTarea.reset();
                    selectTareaGrado.innerHTML = '<option value="">Seleccione Grado</option>'; // Resetear grados
                    selectTareaGrado.disabled = true;
                    cargarTareas(); // Recargar la tabla de tareas
                } else {
                    const error = await res.json();
                    alert('Error al crear tarea: ' + (error.message || JSON.stringify(error)));
                }
            } catch (error) {
                console.error('Error de conexión al crear tarea:', error);
                alert('Error de conexión al crear tarea. Revisa la consola para más detalles.');
            }
        });

        // Evento de envío del formulario para ASIGNAR NOTA
        formAsignarNota.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(formAsignarNota);
            const notaData = Object.fromEntries(formData.entries());

            // Convertir 'calificacion' a número
            notaData.calificacion = Number(notaData.calificacion);

            try {
                // Esta URL debe coincidir con tu ruta POST para asignar notas (ej. en notaRoutes.js)
                
                const res = await fetch('/api/notas-asignadas', { // <-- Nueva URL para la API de notas asignadas
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(notaData)
                });

                if (res.ok) {
                    alert('Nota asignada exitosamente.');
                    formAsignarNota.reset();
                    // Opcional: Recargar la lista de tareas o una tabla de notas asignadas
                } else {
                    const error = await res.json();
                    alert('Error al asignar nota: ' + (error.message || JSON.stringify(error)));
                }
            } catch (error) {
                console.error('Error de conexión al asignar nota:', error);
                alert('Error de conexión al asignar nota. Revisa la consola para más detalles.');
            }
        });

        /* Funciones de Editar y Eliminar Tarea (ejemplo, requerirán implementación en el backend)
        window.editarTarea = async function(id) {
            alert('Funcionalidad de editar tarea no implementada aún para el ejemplo. ID: ' + id);
            // Implementar lógica para cargar la tarea en el formulario y cambiar a modo edición
        };*/

        window.editarTarea = async function(id) {
         try {
                // Obtener los datos de la tarea por su ID
                const res = await fetch(`/api/tareas/${id}`);
                if (!res.ok) throw new Error('No se pudo cargar la tarea');
                const tarea = await res.json();

                // Llenar el formulario con los datos de la tarea
                formNuevaTarea.elements['titulo'].value = tarea.titulo || '';
                formNuevaTarea.elements['nivel'].value = tarea.nivel || '';
                // Disparar el evento para cargar los grados correctos
                const event = new Event('change');
                selectTareaNivel.dispatchEvent(event);
                formNuevaTarea.elements['grado'].value = tarea.grado || '';
                formNuevaTarea.elements['fecha_entrega'].value = tarea.fecha_entrega ? tarea.fecha_entrega.split('T')[0] : '';
                formNuevaTarea.elements['puntos'].value = tarea.puntos || '';

                // Cambiar el modo del formulario a edición
                formNuevaTarea.setAttribute('data-edit-id', id);
                formNuevaTarea.querySelector('button[type="submit"]').textContent = 'Actualizar Tarea';

                // Opcional: Desplazar la vista al formulario
            formNuevaTarea.scrollIntoView({ behavior: 'smooth' });
         } catch (error) {
             alert('Error al cargar la tarea para edición');
             console.error(error);
    }
};

        window.eliminarTarea = async function(id) {
            if (confirm('¿Seguro que deseas eliminar esta tarea?')) {
                try {
                    // Esta URL debe coincidir con tu ruta DELETE para tareas en tareaRoutes.js
                    const res = await fetch(`/api/tareas/${id}`, { method: 'DELETE' });
                    if (res.ok) {
                        alert('Tarea eliminada exitosamente.');
                        cargarTareas(); // Recargar la tabla
                    } else {
                        const error = await res.json();
                        alert('Error al eliminar tarea: ' + (error.message || JSON.stringify(error)));
                    }
                } catch (error) {
                    console.error('Error de conexión al eliminar tarea:', error);
                    alert('Error de conexión al eliminar tarea. Revisa la consola para más detalles.');
                }
            }
        };


        // Cargar datos al iniciar la página
        window.addEventListener('DOMContentLoaded', () => {
            cargarTareas();
            cargarEstudiantes(); // Cargar estudiantes al inicio
        });


