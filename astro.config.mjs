// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// SITE_URL/BASE_PATH permitem builds de pré-visualização em subcaminho
// (ex.: GitHub Pages). O padrão é o domínio oficial na raiz.
const site = process.env.SITE_URL ?? 'https://www.grupo4m.com';
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
