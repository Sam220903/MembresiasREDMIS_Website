---
sidebar_position: 4
title: Módulos de frontend
---

# Módulos de frontend

Los módulos en `js/modules/` contienen la lógica de negocio y de navegación de cada página.

| Módulo | Responsabilidad |
|---|---|
| `login.js` | Toggle de visibilidad de contraseña. |
| `sign-in.js` | Registro de usuario con validación de campos y carga dinámica de universidades, países y estados. |
| `verification.js` | Valida el token JWT y controla rutas de usuario/administrador. |
| `sidebar.js` | Carga dinámicamente el sidebar y maneja el logout. |
| `profile.js` | Edición y guardado del perfil con selects dependientes de país/estado/universidad. |
| `membership_application.js` | Envío de solicitudes de membresía y conversión de CV a base64. |
| `membresias.js` | Listado de membresías del usuario y generación de PDF con jsPDF. |
| `application_info.js` | Detalle y evaluación de solicitudes pendientes. |
| `management.js` | Navegación hacia las herramientas de administración. |
| `addEntities.js` | Agregar y editar países, estados y universidades. |
| `admin_registration.js` | Cambiar el rol de un miembro entre administrador y usuario. |
| `investigationLines.js` | Gestión de líneas de investigación. |
| `statistics.js` | Renderizado de estadísticas y gráfico de país con Chart.js. |
| `settings.js` | Cambio de idioma entre español e inglés. |
| `translate.js` | Carga de traducciones desde `assets/lang/*.json` y traducción de elementos con `data-translate`. |

## Dependencias externas

- **Font Awesome** — íconos.
- **jsPDF** — generación de PDF.
- **Chart.js** — gráficos de estadísticas.
- **DataTables / jQuery** — tablas en administración.
