---
sidebar_position: 1
title: Arquitectura del proyecto
---

# Arquitectura del proyecto

REDMISFront es la interfaz web frontend de REDMIS, una plataforma de gestión de membresías para usuarios y administradores, construida con HTML, CSS y JavaScript (ES modules), consumiendo una API REST externa.

## Estructura de carpetas

| Carpeta | Contenido |
|---|---|
| `index.html` | Landing page, redirige a `pages/login.html`. |
| `pages/` | Páginas principales: login, registro, verificación de correo, perfil, ajustes, membresías, solicitudes, administración y estadísticas. |
| `pages/management/` | Páginas de administración: consulta de miembros y su detalle, tipos de membresía, entidades, líneas de investigación. |
| `partials/` | Fragmentos HTML reutilizables (`sidebar.html`, `sidebarAdmin.html`), cargados dinámicamente por JavaScript. |
| `css/` | Estilos por página y estilos globales compartidos, incluyendo variables de tema claro/oscuro. |
| `assets/` | Imágenes, fuentes, íconos y traducciones de idioma. |
| `js/api/` | Cliente HTTP genérico (`apiClient.js`) y servicios específicos de la API. |
| `js/modules/` | Lógica de frontend, control de páginas y validaciones. |
| `docs-src/` | Fuente de este sitio de documentación Docusaurus. |
| `docs/` | Salida generada del sitio Docusaurus (no editar a mano). |

## Flujo de la aplicación

1. El usuario inicia en `index.html` y es redirigido a `pages/login.html`.
2. Al registrarse, el usuario es redirigido a `pages/verificacion_mail.html`, donde debe ingresar el código enviado a su correo antes de poder iniciar sesión.
3. El formulario de login envía credenciales al servicio `js/api/services/login.js`.
4. Si el servidor responde con un token JWT, se almacena en `localStorage` y se usa en llamadas posteriores.
5. `js/modules/verification.js` valida el token y controla el acceso a páginas según el rol del usuario, usando listas explícitas de rutas de administrador (`adminRoutes`) y de usuario general (`userRoutes`); si un usuario intenta acceder a una ruta que no le corresponde, es redirigido a la página inicial de su rol.
6. `js/modules/sidebar.js` carga la barra lateral adecuada en función del rol y maneja el logout.
7. Las páginas de usuario y administración consumen los servicios de API para obtener y actualizar datos.

## Control de acceso por rol

El control de acceso se realiza en `js/modules/verification.js` en función del campo `role`:

- `1` → administrador
- `2` → usuario general

## Gestión de miembros: página vigente y código heredado

La gestión de miembros y roles se realiza actualmente desde `pages/management/members.html` (listado) y `pages/management/member_info.html` (detalle, cambio de rol, revocación de membresía, descarga de CV y eliminación de usuario), con su lógica en `js/modules/member.js` y `js/modules/member_info.js`.

:::note
`pages/management/admin_registration.html` y `js/modules/admin_registration.js` corresponden a la pantalla anterior de cambio de roles. El código sigue presente en el repositorio, pero **ya no está enlazado** desde el menú de administración (`js/modules/management.js`) ni desde los sidebars: su funcionalidad fue migrada a `member_info.js`. Si vas a limpiar o refactorizar el proyecto, este es un buen candidato a eliminar o a documentar explícitamente como código heredado.
:::
