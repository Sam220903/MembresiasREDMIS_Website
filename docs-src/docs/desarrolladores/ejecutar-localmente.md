---
sidebar_position: 6
title: Ejecutar el proyecto localmente
---

# Ejecutar el proyecto localmente

## Frontend principal

1. Abre `index.html` en un servidor estático o directamente en el navegador.
2. Asegúrate de que el backend esté disponible en el `baseURL` configurado en `js/api/apiClient.js`.
3. Inicia sesión o crea una cuenta.

## Documentación (Docusaurus)

1. Entra a la carpeta `docs-src/`.
2. Ejecuta `npm install`.
3. Ejecuta `npm run start` para levantar el sitio de documentación en modo desarrollo.
4. Ejecuta `npm run build` para generar la carpeta `docs/` que se sirve junto con el resto del sitio.

:::note
El backend REST no está incluido en este repositorio; algunos endpoints y métodos pueden requerir ajustes si la API cambia.
:::
