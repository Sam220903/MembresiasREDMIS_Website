// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'REDMIS',
  tagline: 'Manual de usuario y documentación de la plataforma REDMIS',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Ajusta esta URL a la del despliegue final del sitio.
  url: 'https://sam220903.github.io',
  // El sitio se construye dentro de la carpeta docs/ del propio repo del
  // frontend (ver package.json -> "build": "docusaurus build --out-dir ../docs")
  baseUrl: '/docs/',

  // GitHub pages deployment config.
  organizationName: 'Sam220903',
  projectName: 'MembresiasREDMIS_Website',

  onBrokenLinks: 'throw',

  // El proyecto y su interfaz están en español.
  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl:
            'https://github.com/Sam220903/MembresiasREDMIS_Website/tree/main/docs-src/',
          routeBasePath: '/',
        },
        // El sitio es un manual de usuario, no se usa el blog de Docusaurus.
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/logo-redmis.png',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'REDMIS',
        logo: {
          alt: 'Logo REDMIS',
          src: 'img/logo-redmis.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'manualSidebar',
            position: 'left',
            label: 'Manual de Usuario',
          },
          {
            type: 'docSidebar',
            sidebarId: 'administracionSidebar',
            position: 'left',
            label: 'Administración',
          },
          {
            type: 'docSidebar',
            sidebarId: 'desarrolladoresSidebar',
            position: 'left',
            label: 'Desarrolladores',
          },
          {
            href: '/',
            label: 'Ir a la aplicación',
            position: 'right',
          },
          {
            href: 'https://github.com/Sam220903/MembresiasREDMIS_Website',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentación',
            items: [
              {
                label: 'Manual de Usuario',
                to: '/manual-usuario/intro',
              },
              {
                label: 'Administración',
                to: '/administracion/panel-administracion',
              },
              {
                label: 'Desarrolladores',
                to: '/desarrolladores/arquitectura',
              },
            ],
          },
          {
            title: 'Más',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/Sam220903/MembresiasREDMIS_Website',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} REDMIS. Construido con Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
