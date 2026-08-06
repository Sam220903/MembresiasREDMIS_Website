---
sidebar_position: 4
title: Módulos de frontend
---

# Módulos de frontend

Los módulos en `js/modules/` contienen la lógica de negocio y de navegación de cada página.

| Módulo | Responsabilidad |
|---|---|
| `login.js` | Toggle de visibilidad de contraseña. |
| `sign-in.js` | Registro de usuario con validación de campos (nombre, contraseña segura, confirmación) y carga dinámica de universidades, países y estados; redirige a la verificación de correo tras registrarse. |
| `verification.js` | Valida el token JWT y controla rutas de usuario/administrador mediante listas explícitas de rutas permitidas por rol. |
| `sidebar.js` | Carga dinámicamente el sidebar y maneja el logout. |
| `theme.js` | Aplica y persiste el tema visual (claro, oscuro o según preferencia del sistema) en `localStorage`, y sincroniza el selector de tema en la página de Ajustes. |
| `settings.js` | Cambio de idioma entre español e inglés en la página de Ajustes. |
| `profile.js` | Edición y guardado del perfil, con selects dependientes de país/estado/universidad, autocompletado de línea de investigación (con creación implícita de nuevas líneas) y gestión de CV (previsualización y subida). |
| `pdfProcessor.js` | Utilidades compartidas para convertir archivos PDF a base64/Blob y generar URLs de previsualización, usadas por `profile.js`, `membership_application.js`, `application_info.js` y `member_info.js`. |
| `membership_application.js` | Envío de solicitudes de membresía; reutiliza el CV ya registrado del usuario o permite adjuntar uno nuevo mediante `pdfProcessor.js`. |
| `membresias.js` | Listado de membresías del usuario y generación del carnet de membresía en PDF con jsPDF. |
| `application_info.js` | Detalle y evaluación (aprobación con comentario opcional / rechazo con motivo obligatorio) de solicitudes pendientes. |
| `management.js` | Navegación hacia las herramientas de administración. |
| `member.js` | Listado de miembros con solicitud aceptada, en la pantalla de "Consultar miembros". |
| `member_info.js` | Ficha de detalle de un miembro: datos completos, cambio de rol, revocación/reactivación de membresía, descarga de CV y eliminación de usuario. |
| `addEntities.js` | Alta, edición, búsqueda y eliminación de países, estados y universidades. |
| `admin_registration.js` | **Código heredado.** Cambiaba el rol de un miembro entre administrador y usuario desde una pantalla independiente; su funcionalidad fue migrada a `member_info.js` y la página ya no está enlazada desde el menú. |
| `investigationLines.js` | Alta, búsqueda y eliminación de líneas de investigación. |
| `membership-type.js` | Alta, búsqueda y eliminación de tipos de membresía (no soporta edición). |
| `statistics.js` | Renderizado de los paneles de estadísticas (miembros y solicitudes/membresías) y del gráfico de país con Chart.js. |
| `translate.js` | Carga de traducciones desde `assets/lang/*.json` y traducción de elementos con `data-translate`. |

## Dependencias externas

- **Font Awesome** — íconos.
- **jsPDF** — generación de PDF (carnet de membresía).
- **Chart.js** — gráficos de estadísticas.
- **DataTables / jQuery** — tablas en administración.
