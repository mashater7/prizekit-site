import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://24kitbot.ru',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'never' },
});
