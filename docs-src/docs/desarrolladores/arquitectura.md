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
| `pages/` | Páginas principales: login, registro, perfil, membresías, solicitudes, administración y estadísticas. |
| `partials/` | Fragmentos HTML reutilizables (`sidebar.html`, `sidebarAdmin.html`), cargados dinámicamente por JavaScript. |
| `css/` | Estilos por página y estilos globales compartidos. |
| `assets/` | Imágenes, fuentes, íconos y traducciones de idioma. |
| `js/api/` | Cliente HTTP genérico (`apiClient.js`) y servicios específicos de la API. |
| `js/modules/` | Lógica de frontend, control de páginas y validaciones. |
| `docs-src/` | Fuente de este sitio de documentación Docusaurus. |
| `docs/` | Salida generada del sitio Docusaurus (no editar a mano). |

## Flujo de la aplicación

1. El usuario inicia en `index.html` y es redirigido a `pages/login.html`.
2. El formulario de login envía credenciales al servicio `js/api/services/login.js`.
3. Si el servidor responde con un token JWT, se almacena en `localStorage` y se usa en llamadas posteriores.
4. `js/modules/verification.js` valida el token y controla el acceso a páginas según el rol del usuario.
5. `js/modules/sidebar.js` carga la barra lateral adecuada en función del rol y maneja el logout.
6. Las páginas de usuario y administración consumen los servicios de API para obtener y actualizar datos.

## Control de acceso por rol

El control de acceso se realiza en `js/modules/verification.js` en función del campo `role`:

- `1` → administrador
- `2` → usuario general
