import loginService from '../api/services/login.js';
import { translate } from './translate.js';

// Calcula el prefijo según la profundidad de la ruta actual
const getBasePath = () => {
    const parts = window.location.pathname.split('/').filter(Boolean);
    const rootIndex = parts.indexOf('pages');
    const endsWithSlash = window.location.pathname.endsWith('/');
    const depth = parts.length - rootIndex - 1 + (endsWithSlash ? 1 : 0);
    return '../'.repeat(depth);
}


// Verificar el token y el rol del usuario al cargar la página

document.addEventListener('DOMContentLoaded', () => {
    const userRole = loginService.getUserRole(); 

    const tokenIsValid = loginService.validateToken();
    const basePath = getBasePath();

    if (!tokenIsValid) {
        // Si el token no es válido, redirigir a la página de inicio de sesión
        window.location.href = `${basePath}pages/login.html`;
    }

    const adminRoutes = [
        'membresia.html',
        'applications.html',
        'statistics.html',
        'members.html',
        'application_info.html',
        'member_info.html',
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


    // Obtener el idioma de local storage y establecerlo al cargar la página
    const savedLanguage = localStorage.getItem('language');
    const browserLanguage = navigator.language.slice(0, 2);
    const defaultLanguage = 'es';
    const supportedLanguages = ['es', 'en'];

    const currentLanguage = savedLanguage || (supportedLanguages.includes(browserLanguage) ? browserLanguage : defaultLanguage);

    translate(currentLanguage);

});