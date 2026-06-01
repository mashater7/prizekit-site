import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// site обновим на реальный домен при переносе с GitHub Pages.
export default defineConfig({
  site: 'https://example.github.io',
  integrations: [sitemap()],
});
