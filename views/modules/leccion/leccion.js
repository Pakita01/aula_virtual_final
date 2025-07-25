// Solo se usa el curso de francés, no se requiere ID
    let editId = null;

    window.addEventListener('DOMContentLoaded', cargarLecciones);

    async function cargarLecciones() {
        try {
            const res = await fetch(`/api/lecciones`);
            const data = await res.json();
            const tbody = document.getElementById('lecciones-tbody');
            tbody.innerHTML = '';
            if (Array.isArray(data)) {
                data.forEach((leccion, idx) => {
                    tbody.innerHTML += `
                        <tr>
                            <td>${idx + 1}</td>
                            <!-- <td>
                                //${leccion.imagenUrl ? `<img src="${leccion.imagenUrl}" alt="img" style="max-width:60px;max-height:40px;object-fit:cover;display:block;margin-bottom:4px;">` : ''}
                                //${leccion.imagenUrl ? `<div style='font-size:11px;word-break:break-all;'><a href="${leccion.imagenUrl}" target="_blank">Ver URL</a></div>` : ''}
                            </td>-->
                            <td>${leccion.titulo}</td>
                            <td>${leccion.descripcion}</td>
                            <td>${leccion.fecha_creacion ? (new Date(leccion.fecha_creacion)).toLocaleDateString() : ''}</td>
                            <td>${leccion.duracion} min</td>
                            <td><span class="status ${leccion.estado && leccion.estado.toLowerCase ? leccion.estado.toLowerCase() : ''}">${leccion.estado || ''}</span></td>
                            <!-- <td>
                                //${leccion.archivoUrl ? `<a href="${leccion.archivoUrl}" target="_blank">Descargar</a>` : ''}
                            </td>-->
                            <td>
                                <button class="btn-icon" onclick="editarLeccion('${leccion._id}')"><i class="fas fa-edit" id="edit"></i></button>
                                <button class="btn-icon danger" onclick="eliminarLeccion('${leccion._id}')"><i class="fas fa-trash" id="delete"></i></button>
                            </td>
                        </tr>
                    `;
                });
            } else {
                tbody.innerHTML = '<tr><td colspan="10">No hay lecciones o error al cargar.</td></tr>';
            }
        } catch (err) {
            alert('Error de conexión con el servidor');
        }
    }

    // Mostrar modal para crear
    document.getElementById('add-leccion').addEventListener('click', function() {
        document.getElementById('modal-title').textContent = 'Nueva Lección';
        document.getElementById('modal-leccion').style.display = 'flex';
        document.getElementById('form-leccion').reset();
        editId = null;
    });
    document.getElementById('close-modal').addEventListener('click', function() {
        document.getElementById('modal-leccion').style.display = 'none';
        editId = null;
    });

    // Crear o editar lección
    document.getElementById('form-leccion').addEventListener('submit', async function(e) {
        e.preventDefault();
        const form = e.target;
        const leccion = {
            titulo: form.titulo.value,
            descripcion: form.descripcion.value,
            duracion: Number(form.duracion.value),
            contenido: form.contenido.value,
            estado: form.estado.value,
            imagenUrl: form.imagenUrl.value || ''
        };
        // Si se sube archivo, lo enviamos como FormData, si no, JSON normal
        const archivoInput = form.archivo;
        let url = `/api/lecciones`;
        let method = 'POST';
        let body, headers;
        if (editId) {
            url += `/${editId}`;
            method = 'PUT';
        }
        if (archivoInput && archivoInput.files && archivoInput.files.length > 0) {
            body = new FormData();
            for (const key in leccion) body.append(key, leccion[key]);
            body.append('archivo', archivoInput.files[0]);
            headers = undefined; // fetch detecta FormData
        } else {
            body = JSON.stringify(leccion);
            headers = { 'Content-Type': 'application/json' };
        }
        try {
            const res = await fetch(url, {
                method,
                headers,
                body
            });
            if (res.ok) {
                document.getElementById('modal-leccion').style.display = 'none';
                form.reset();
                editId = null;
                cargarLecciones();
            } else {
                const error = await res.json();
                alert('Error al guardar lección: ' + (error.error || error.message || 'Error desconocido'));
            }
        } catch (err) {
            alert('Error de conexión');
        }
    });

    // Eliminar lección
    window.eliminarLeccion = async function(id) {
        if (confirm('¿Seguro que deseas eliminar esta lección?')) {
            await fetch(`/api/lecciones/${id}`, { method: 'DELETE' });
            cargarLecciones();
        }
    }

    // Editar lección
    window.editarLeccion = async function(id) {
        try {
            const res = await fetch(`/api/lecciones`);
            const lecciones = await res.json();
            const leccion = lecciones.find(l => l._id === id);
            if (!leccion) return alert('Lección no encontrada');
            document.getElementById('modal-title').textContent = 'Editar Lección';
            document.getElementById('modal-leccion').style.display = 'flex';
            const form = document.getElementById('form-leccion');
            form.titulo.value = leccion.titulo;
            form.descripcion.value = leccion.descripcion;
            form.duracion.value = leccion.duracion;
            form.contenido.value = leccion.contenido;
            form.estado.value = leccion.estado;
            form.imagenUrl.value = leccion.imagenUrl || '';
            editId = id;
        } catch (err) {
            alert('Error al cargar lección para editar');
        }
    }