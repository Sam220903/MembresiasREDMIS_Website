---
sidebar_position: 7
title: Convenciones de código
---

# Convenciones de código

Lineamientos a seguir al contribuir en el proyecto:

- Prefiere **funciones explícitas y separadas por cada acción**, en lugar de funciones que resuelvan varios casos a la vez.
- Evita **operadores ternarios sin comentar** cuando la condición no sea evidente a simple vista.
- No modifiques archivos fuera del alcance de la tarea en curso.
- Mantén la capa `apiClient` como único punto de acceso HTTP; los nuevos servicios deben apoyarse en ella en lugar de hacer llamadas directas con `fetch`.
- Si una funcionalidad ya fue migrada a un módulo nuevo (por ejemplo, el cambio de rol migrado de `admin_registration.js` a `member_info.js`), no la extiendas en el archivo antiguo: actualiza el módulo vigente y considera eliminar el código heredado una vez confirmado que ya no se usa.
