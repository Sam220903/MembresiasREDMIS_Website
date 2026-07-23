# REDMISFront

## Descripción general

Este proyecto es la interfaz web frontend de REDMIS, una plataforma de gestión de membresías para usuarios y administradores. La aplicación está construida con HTML, CSS, JavaScript y un conjunto de módulos que consumen una API REST para autenticación, gestión de miembros, solicitudes de membresía, configuración de entidades y estadísticas.

## Estructura del proyecto

- `index.html`
  - Landing page que redirige inmediatamente a `pages/login.html`.
- `pages/`
  - Contiene todas las páginas principales de la aplicación: login, registro, perfil, membresías, solicitudes, administración y estadísticas.
- `partials/`
  - Fragmentos HTML reutilizables, como `sidebar.html` y `sidebarAdmin.html`, cargados dinámicamente por JavaScript.
- `css/`
  - Estilos para cada página y estilos globales compartidos.
- `assets/`
  - Imágenes, fuentes, iconos y traducciones de idioma.
- `js/api/`
  - Cliente HTTP genérico (`apiClient.js`) y servicios específicos de la API.
- `js/modules/`
  - Lógica de frontend, control de páginas y validaciones.
- `docs-src/`
  - Fuente de un sitio Docusaurus independiente que genera la documentación en `docs/`.
- `docs/`
  - Salida generada del sitio Docusaurus.

## Flujo de la aplicación

1. El usuario inicia en `index.html` y es redirigido a `pages/login.html`.
2. El formulario de login envía credenciales al servicio `js/api/services/login.js`.
3. Si el servidor responde con un token JWT, se almacena en `localStorage` y se usa para llamadas posteriores.
4. El módulo `js/modules/verification.js` valida el token y controla el acceso a páginas según el rol del usuario.
5. `js/modules/sidebar.js` carga la barra lateral adecuada en función del rol y permite cerrar sesión.
6. Las páginas de usuario y administración consumen servicios API para obtener y actualizar datos.

## Páginas principales

- `pages/login.html`
  - Inicio de sesión.
- `pages/sign-in.html`
  - Registro de nuevos usuarios.
- `pages/profile.html`
  - Edición del perfil de usuario.
- `pages/memberships.html`
  - Visualiza las membresías activas del usuario y permite descargar constancias en PDF.
- `pages/membership_application.html`
  - Solicitud de membresía con adjunto de CV en PDF.
- `pages/applications.html`
  - Vista de administrador para revisar solicitudes de membresía pendientes.
- `pages/application_info.html`
  - Detalle de cada solicitud con opción de aprobar o rechazar.
- `pages/statistics.html`
  - Panel de estadísticas con gráficos y conteos.
- `pages/management/index.html`
  - Navegación de administración para control de roles, tipos de membresía, entidades y líneas de investigación.
- `pages/management/admin_registration.html`
  - Gestión de roles de usuarios.
- `pages/management/membership-type.html`
  - Alta y eliminación de tipos de membresía.
- `pages/management/addEntities.html`
  - Gestión de países, estados y universidades.
- `pages/management/investigation-lines.html`
  - Gestión de líneas de investigación.

## Servicios de API

El cliente base está en `js/api/apiClient.js`.

### Endpoints principales

- `js/api/services/login.js`
  - Login, logout, estado de autenticación, token y rol.
- `js/api/services/members.js`
  - Gestión de miembros: obtener, crear, actualizar y verificar códigos.
- `js/api/services/membershipApplication.js`
  - Solicitar, aceptar, rechazar y listar solicitudes de membresía.
- `js/api/services/memberships.js`
  - Tipos de membresía: obtener, agregar y eliminar.
- `js/api/services/membresiaUsuario.js`
  - Obtener membresías de un usuario y actualizar estados.
- `js/api/services/country.js`, `states.js`, `universities.js`
  - Catálogos de países, estados y universidades.
- `js/api/services/statistics.js`
  - Datos de estadísticas para la vista administrativa.
- `js/api/services/roles.js`
  - Cambio de rol de usuario.

### Configuración del cliente

- `js/api/apiClient.js`
  - URL base: `http://localhost:8080/backend/public`
  - Timeout: `30000` ms
  - Headers: JSON
  - Soporta Authorization Bearer token.

> Ajusta `baseURL` si tu backend está en otra ruta.

## Módulos de frontend

- `js/modules/login.js`
  - Toggle de visibilidad de contraseña.
- `js/modules/sign-in.js`
  - Registro de usuario con validación de campos y carga dinámica de universidades, países y estados.
- `js/modules/verification.js`
  - Valida token JWT y controla rutas de usuario/administrador.
- `js/modules/sidebar.js`
  - Carga dinámicamente el sidebar y maneja logout.
- `js/modules/profile.js`
  - Edición y guardado del perfil con selects dependientes para país/estado/universidad.
- `js/modules/membership_application.js`
  - Envío de solicitudes de membresía y conversión de CV a base64.
- `js/modules/membresias.js`
  - Listado de membresías del usuario y generación de PDF con jsPDF.
- `js/modules/application_info.js`
  - Detalle y evaluación de solicitudes pendientes.
- `js/modules/management.js`
  - Navegación hacia las herramientas de administración.
- `js/modules/addEntities.js`
  - Agregar y editar países, estados y universidades.
- `js/modules/admin_registration.js`
  - Cambiar rol de un miembro entre administrador y usuario.
- `js/modules/investigationLines.js`
  - Gestión de líneas de investigación.
- `js/modules/statistics.js`
  - Renderizado de estadísticas y gráfico de país con Chart.js.
- `js/modules/settings.js`
  - Cambio de idioma entre español e inglés.
- `js/modules/translate.js`
  - Carga de traducciones desde `assets/lang/*.json` y traducción de elementos con `data-translate`.

## Internationalization / Localización

- `assets/lang/es.json`
  - Traducciones al español.
- `js/modules/translate.js`
  - Carga y aplica traducciones según idioma guardado en `localStorage`.
- `js/modules/settings.js`
  - Botones de cambio de idioma.

## Dependencias externas

El frontend usa algunas dependencias cargadas desde CDN o archivo local:

- Font Awesome (iconos)
- jsPDF (generación de PDF)
- Chart.js (gráficos de estadísticas)
- DataTables / jQuery (tablas en administración)

## Cómo ejecutar

### Frontend principal

1. Abre `index.html` en un servidor estático o directamente en el navegador.
2. Asegúrate de que el backend esté disponible en el `baseURL` configurado.
3. Inicia sesión o crea una cuenta.

### Documentación / Docusaurus

1. Entra a `docs-src/`.
2. Ejecuta `npm install` y luego `npm run start` para desarrollar el sitio de documentación.
3. Ejecuta `npm run build` para generar la carpeta `docs/`.

## Notas de desarrollo

- El token JWT se guarda en `localStorage` y la aplicación lo reutiliza para todas las solicitudes autorizadas.
- El control de acceso se realiza en `js/modules/verification.js` en función de `role`:
  - `1` → administrador
  - `2` → usuario general
- El sidebar se construye dinámicamente con HTML parcial, lo que facilita mantener una sola plantilla común.
- La página de membresías del usuario genera PDF localmente sin depender de un servicio externo.

## Consideraciones

- El proyecto depende de un backend REST que no está presente en este repositorio.
- Algunos endpoints y métodos pueden requerir ajustes si el backend cambia la API.
- La configuración actual de Docusaurus es heredada y puede necesitar personalización para este proyecto.

---

### Resumen rápido

- `index.html` → redirección a login
- `pages/` → interfaz del usuario y admin
- `js/api/` → cliente HTTP + servicios API
- `js/modules/` → lógica de negocio y navegación
- `assets/lang/` → traducciones
- `docs-src/` → sitio de documentación Docusaurus

Este README resume la arquitectura, los componentes y cómo trabajar con la aplicación REDMIS Frontend.