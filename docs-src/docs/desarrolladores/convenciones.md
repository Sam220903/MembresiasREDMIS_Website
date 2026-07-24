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
