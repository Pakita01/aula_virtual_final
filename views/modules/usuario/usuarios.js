document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let usuarios = [];
    let currentPage = 1;
    const itemsPerPage = 10;
    
    // Elementos del DOM
    const usuariosTable = document.getElementById('usuariosTable').querySelector('tbody');
    const usuarioModal = document.getElementById('usuarioModal');
    const usuarioForm = document.getElementById('usuarioForm');
    const filtroRol = document.getElementById('filtroRol');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    
    // Event Listeners
    document.getElementById('nuevoUsuarioBtn').addEventListener('click', () => {
        openUsuarioModal();
    });
    
    document.querySelector('.close').addEventListener('click', () => {
        usuarioModal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === usuarioModal) {
            usuarioModal.style.display = 'none';
        }
    });
    
    filtroRol.addEventListener('change', cargarUsuarios);
    prevPageBtn.addEventListener('click', goToPrevPage);
    nextPageBtn.addEventListener('click', goToNextPage);
    
    usuarioForm.addEventListener('submit', handleUsuarioSubmit);
    
    // Inicialización
    cargarUsuarios();
    
    // Funciones
    async function cargarUsuarios() {
        try {
            let url = '/api/usuarios';
            if (filtroRol.value) {
                url += `?rol=${filtroRol.value}`;
            }
            
            const response = await fetch(url, {
                headers: {
                    'x-token': localStorage.getItem('token') || ''
                }
            });
            
            if (!response.ok) {
                throw new Error('Error al cargar usuarios');
            }
            
            usuarios = await response.json();
            currentPage = 1;
            renderUsuarios();
            updatePagination();
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    }
    
    function renderUsuarios() {
        usuariosTable.innerHTML = '';
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedUsuarios = usuarios.slice(startIndex, endIndex);
        
        if (paginatedUsuarios.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="6" class="no-data">No hay usuarios registrados</td>';
            usuariosTable.appendChild(row);
            return;
        }
        
        paginatedUsuarios.forEach(usuario => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${usuario.nombre} ${usuario.apellido}</td>
                <td>${usuario.email}</td>
                <td>${usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1)}</td>
                <td>${new Date(usuario.fecha_registro).toLocaleDateString()}</td>
                <td class="${usuario.activo ? 'estado-activo' : 'estado-inactivo'}">
                    ${usuario.activo ? 'Activo' : 'Inactivo'}
                </td>
                <td class="actions">
                    <button class="btn-icon edit" data-id="${usuario._id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon ${usuario.activo ? 'delete' : 'activate'}" data-id="${usuario._id}">
                        <i class="fas ${usuario.activo ? 'fa-user-slash' : 'fa-user-check'}"></i>
                    </button>
                </td>
            `;
            
            usuariosTable.appendChild(row);
        });
        
        // Agregar event listeners a los botones
        document.querySelectorAll('.edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const usuarioId = e.target.closest('button').getAttribute('data-id');
                const usuario = usuarios.find(u => u._id === usuarioId);
                openUsuarioModal(usuario);
            });
        });
        
        document.querySelectorAll('.delete, .activate').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const usuarioId = e.target.closest('button').getAttribute('data-id');
                const usuario = usuarios.find(u => u._id === usuarioId);
                
                if (usuario.activo) {
                    desactivarUsuario(usuarioId);
                } else {
                    activarUsuario(usuarioId);
                }
            });
        });
    }
    
    function openUsuarioModal(usuario = null) {
        const modalTitulo = document.getElementById('modalTitulo');
        const form = document.getElementById('usuarioForm');
        
        form.reset();
        document.getElementById('passwordHelp').style.display = 'block';
        
        if (usuario) {
            modalTitulo.textContent = 'Editar Usuario';
            document.getElementById('usuarioId').value = usuario._id;
            document.getElementById('nombre').value = usuario.nombre;
            document.getElementById('apellido').value = usuario.apellido;
            document.getElementById('email').value = usuario.email;
            document.getElementById('email').readOnly = true;
            document.getElementById('rol').value = usuario.rol;
            document.getElementById('avatar').value = usuario.avatar || '';
            document.getElementById('activo').checked = usuario.activo;
            
            // Ocultar ayuda de contraseña si es edición
            document.getElementById('passwordHelp').style.display = 'block';
            document.getElementById('password').placeholder = 'Nueva contraseña';
        } else {
            modalTitulo.textContent = 'Nuevo Usuario';
            document.getElementById('email').readOnly = false;
            document.getElementById('activo').checked = true;
            document.getElementById('password').required = true;
            document.getElementById('password').placeholder = '';
        }
        
        usuarioModal.style.display = 'block';
    }
    
    async function handleUsuarioSubmit(e) {
        e.preventDefault();
        
        const usuarioId = document.getElementById('usuarioId').value;
        const formData = {
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            rol: document.getElementById('rol').value,
            activo: document.getElementById('activo').checked,
            avatar: document.getElementById('avatar').value || undefined
        };
        
        // Solo agregar email si es nuevo usuario
        if (!usuarioId) {
            formData.email = document.getElementById('email').value;
            formData.password = document.getElementById('password').value;
        } else {
            // Si es edición y se ingresó contraseña
            const password = document.getElementById('password').value;
            if (password) {
                formData.password = password;
            }
        }
        
        try {
            let response;
            let method;
            let url;
            
            if (usuarioId) {
                method = 'PUT';
                url = `/api/usuarios/${usuarioId}`;
            } else {
                method = 'POST';
                url = '/api/usuarios';
            }
            
            response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'x-token': localStorage.getItem('token') || ''
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al guardar el usuario');
            }
            
            usuarioModal.style.display = 'none';
            cargarUsuarios();
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    }
    
    async function desactivarUsuario(id) {
        if (!confirm('¿Estás seguro de desactivar este usuario?')) {
            return;
        }
        
        try {
            const response = await fetch(`/api/usuarios/${id}`, {
                method: 'DELETE',
                headers: {
                    'x-token': localStorage.getItem('token') || ''
                }
            });
            
            if (!response.ok) {
                throw new Error('Error al desactivar usuario');
            }
            
            cargarUsuarios();
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    }
    
    async function activarUsuario(id) {
        if (!confirm('¿Estás seguro de reactivar este usuario?')) {
            return;
        }
        
        try {
            const response = await fetch(`/api/usuarios/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-token': localStorage.getItem('token') || ''
                },
                body: JSON.stringify({ activo: true })
            });
            
            if (!response.ok) {
                throw new Error('Error al activar usuario');
            }
            
            cargarUsuarios();
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    }
    
    function updatePagination() {
        const totalPages = Math.ceil(usuarios.length / itemsPerPage);
        
        pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    }
    
    function goToPrevPage() {
        if (currentPage > 1) {
            currentPage--;
            renderUsuarios();
            updatePagination();
        }
    }
    
    function goToNextPage() {
        const totalPages = Math.ceil(usuarios.length / itemsPerPage);
        
        if (currentPage < totalPages) {
            currentPage++;
            renderUsuarios();
            updatePagination();
        }
    }
});