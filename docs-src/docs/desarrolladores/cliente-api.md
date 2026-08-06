---
sidebar_position: 2
title: Cliente API
---

# Cliente API

El cliente HTTP base se encuentra en `js/api/apiClient.js` y es utilizado por todos los servicios del proyecto.

## Configuración

- **URL base:** `http://localhost:8080/backend/public`
- **Timeout:** `30000` ms
- **Headers:** JSON
- **Autenticación:** soporta `Authorization: Bearer <token>`

:::caution
Ajusta el `baseURL` en `apiClient.js` si tu backend está desplegado en otra ruta o dominio. El archivo incluye, comentadas, otras URLs de referencia (entorno local con Apache y el entorno de producción); descomenta la que corresponda a tu entorno.
:::

## Uso general

Los servicios en `js/api/services/` importan y utilizan `apiClient` para realizar las peticiones HTTP, manteniendo una única capa de abstracción para toda la aplicación.
