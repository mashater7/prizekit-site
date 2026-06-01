import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://mashater7.github.io',
  base: '/prizekit-site',
  integrations: [sitemap()],
});
