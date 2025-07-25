// Función para cargar la navegación en todas las páginas
function loadNavigation() {
    const navContainer = document.getElementById('nav-container');
    
    if (navContainer) {
        navContainer.innerHTML = `
            <nav>
                <div class="logo">
                    <i class="fas fa-graduation-cap fa-3x" id="log"></i>
                    <h2>Oh là là Club</h2>
                </div>
                <ul>
                    <li class="dashboard">
                        <a href="../../admin">
                            <i class="fas fa-tachometer-alt"></i>
                            <span>Dashboard</span>
                        </a>
                    </li>
                    <li class="pagos">
                        <a href="../pago/pagos.html">
                            <i class="fas fa-money-bill-wave"></i>
                            <span>Gestionar Pagos</span>
                        </a>
                    </li>
                    <li class="lecciones">
                        <a href="../leccion/leccion.html">
                            <i class="fas fa-chalkboard-teacher"></i>
                            <span>Gestionar Unidades</span>
                        </a>
                    </li>
                    <li class="tareas">
                        <a href="../tarea/tareas.html">
                            <i class="fas fa-tasks"></i>
                            <span>Gestionar Tareas</span>
                        </a>
                    </li>
                </ul>
            </nav>
        `;
        
        // Resaltar elemento activo en el nav
        const currentPage = window.location.pathname.split('/').pop();
        const navItems = {
            'index.html': 'dashboard',
            'pagos.html': 'pagos',
            'tareas.html': 'tareas',
            'leccion.html': 'lecciones',
            'forros.html': 'forross',
        };
        
        const activeItem = navItems[currentPage];
        if (activeItem) {
            const activeElement = document.querySelector(`.${activeItem}`);
            if (activeElement) {
                activeElement.classList.add('active');
            }
        }
    }
}

// Cargar navegación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', loadNavigation);
