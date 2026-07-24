---
sidebar_position: 3
title: Servicios de API
---

# Servicios de API

Los servicios viven en `js/api/services/` y encapsulan las llamadas a cada grupo de endpoints.

| Servicio | Responsabilidad |
|---|---|
| `login.js` | Login, logout, estado de autenticación, token y rol. |
| `members.js` | Gestión de miembros: obtener, crear, actualizar y verificar códigos. |
| `membershipApplication.js` | Solicitar, aceptar, rechazar y listar solicitudes de membresía. |
| `memberships.js` | Tipos de membresía: obtener, agregar y eliminar. |
| `membresiaUsuario.js` | Obtener membresías de un usuario y actualizar estados. |
| `country.js`, `states.js`, `universities.js` | Catálogos de países, estados y universidades. |
| `statistics.js` | Datos de estadísticas para la vista administrativa. |
| `roles.js` | Cambio de rol de usuario. |

Cada servicio consume el cliente HTTP definido en [Cliente API](./cliente-api).
