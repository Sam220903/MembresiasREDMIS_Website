import loginService from '/js/api/services/login.js';

document.addEventListener('DOMContentLoaded', () => {
    const userRole = loginService.getUserRole(); 

    const tokenIsValid = loginService.validateToken();

    if (!tokenIsValid) {
        // Si el token no es válido, redirigir a la página de inicio de sesión
        window.location.href = 'login.html';
    }

    const adminRoutes = [
        'membresia.html',
        'applications.html',
        'admin_registration.html',
        'statistics.html',
        'members.html',
        'application_info.html',
        'member_info.html',
        'admin_registration.html',
        'AgregarEstado.html',
        'AgregarPais.html',
        'AgregarUniversidad.html'
    ];

    const userRoutes = [
        'membership_application.html',
    ];

    const currentPath = window.location.pathname.split('/').pop(); 

    const isAdmin = userRole === 1
    const isUser = userRole === 2;

    // Verificar si el usuario es un administrador y redirigir a la página de administración si intenta acceder a una página de usuario
    if (isAdmin && userRoutes.includes(currentPath)) {
        // Pantalla en blanco para evitar el parpadeo
        document.body.innerHTML = ''; // Limpiar el contenido de la página
        window.location.href = 'members.html';
    }
    // Verificar si el usuario es un usuario y redirigir a la página de perfil si intenta acceder a una página de administración
    if (isUser && adminRoutes.includes(currentPath)) {
        // Pantalla en blanco para evitar el parpadeo
        document.body.innerHTML = ''; // Limpiar el contenido de la página
        window.location.href = 'profile.html';
    }

    // Verificar si el usuario está autenticado, de lo contrario redirigir a la página de inicio de sesión
    if(!loginService.isAuthenticated()) {
        window.location.href = 'login.html';
    } 

});