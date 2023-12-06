// @ts-check
import { themes as prismThemes } from 'prism-react-renderer';

const config = {
  title: 'Langdrive Documents',
  tagline: 'Easily Train AI models with your own data',
  favicon: 'https://addy-ai.com/favicon.ico',
  url: 'https://docs.langdrive.ai/',
  baseUrl: '/',
  organizationName: 'addy-ai',
  projectName: 'langdrive',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      'classic',
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  themeConfig: {
    image: 'https://addy-ai.com/static/media/logo.8f4a17f3b5148a7b4e66.png',
    navbar: {
      title: 'Langdrive',
      logo: {
        alt: 'Langdrive Logo',
        src: 'https://avatars.githubusercontent.com/u/122666693?s=48&v=4',
      },
      items: [
        {  
          type: 'docSidebar',
          sidebarId: 'apiSidebar',
          label: 'Getting Started', 
          position: 'left' 
        },
        {   
          sidebarId: 'apiSidebar', 
          to: '/docs/overview/intro',
          label: 'Docs', 
          position: 'left' 
        },
        {   
          sidebarId: 'apiSidebar', 
          to: '/docs/api/cli',
          label: 'API', 
          position: 'left' 
        },
        {to: '/blog', label: 'Blog', position: 'right'},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        // ... [Your existing footer links]
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Addy-AI. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
};

module.exports = config;
