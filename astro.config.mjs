// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://paritas.eu',
  output: 'static',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  i18n: {
    locales: ['en', 'hu'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false, redirectToDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', hu: 'hu-HU' } },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
