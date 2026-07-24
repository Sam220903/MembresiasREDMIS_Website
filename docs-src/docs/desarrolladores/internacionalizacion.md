---
sidebar_position: 5
title: Internacionalización (i18n)
---

# Internacionalización (i18n)

- `assets/lang/es.json` y `assets/lang/en.json` contienen las traducciones de la interfaz.
- `js/modules/translate.js` carga las traducciones y las aplica a los elementos marcados con `data-translate`, según el idioma guardado en `localStorage`.
- `js/modules/settings.js` implementa los botones de cambio de idioma en la sección de configuración.
