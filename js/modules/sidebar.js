import loginService from '../api/services/login.js';

// Calcula el prefijo según la profundidad de la ruta actual
const getBasePath = () => {
    const parts = window.location.pathname.split('/').filter(Boolean);
    const rootIndex = parts.indexOf('pages');
    const endsWithSlash = window.location.pathname.endsWith('/');
    const depth = parts.length - rootIndex - 1 + (endsWithSlash ? 1 : 0);
    return '../'.repeat(depth);
}


document.addEventListener("DOMContentLoaded", function() {

    const base = getBasePath();    
    
    const userRole = loginService.getUserRole(); // Obtener el rol del usuario desde el servicio de autenticación
    const sidebarUser = `${base}partials/sidebar.html`;
    const sidebarAdmin = `${base}partials/sidebarAdmin.html`;

    if (userRole === 1) { 
        loadSidebar(sidebarAdmin, base);
    } else if (userRole === 2) { 
        loadSidebar(sidebarUser, base);
    } 
});


const displaySidebar = () => {
    const sidebarDiv = document.getElementById("sidebar");
    sidebarDiv.style.display = "flex";
}

const displaySidebarBtn = document.getElementById("display-sidebar");
displaySidebarBtn.addEventListener("click", displaySidebar);





const loadSidebar = (sidebarPath, basePath) => {

  const sidebarDiv = document.getElementById('sidebar');

  fetch(sidebarPath)
      .then(res => res.text())
      .then(html => {
          const processedHtml = html.replaceAll('{{base}}', basePath);
          sidebarDiv.innerHTML = processedHtml;
          const path = window.location.pathname.split('/').pop();
          const links = document.querySelectorAll('.sidebar-menu-item');
          
          // Marcar la página actual como activa
         links.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref) {
                const hrefParts = linkHref.split('/').filter(Boolean);
                const hrefEnd = hrefParts[hrefParts.length - 1]; // último segmento del href
                if (path === hrefEnd) {
                    link.classList.add('active');
                }
            }
        }); 

            

          // Bloque de cierre de sesión
          const logout_btn = document.getElementById("logout-button");
          if (logout_btn) {
              logout_btn.addEventListener('click', async () => {
                  try {
                      const confirmation = confirm("¿Estás seguro de que deseas cerrar sesión?");
                      if (!confirmation) {
                          return; 
                      }
                      await loginService.logout();   
                      window.location.href = `${basePath}pages/login.html`;
                  } catch (error) {
                      console.error('Error al cerrar sesión:', error);
                  }
              });
          }

          const hideSidebar = () => {
            const sidebarDiv = document.getElementById("sidebar");
            sidebarDiv.style.display = "none";
          };

          const hideSidebarBtn = document.getElementById("hide-sidebar");
          hideSidebarBtn.addEventListener("click", hideSidebar);
      })
      .catch(error => {
          console.error('Error loading sidebar:', error);
      });
}