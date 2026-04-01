import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import sanity from '@sanity/astro';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://ficcc.org',
  output: 'static',
  adapter: vercel(),
  integrations: [
    sitemap(),
    sanity({
      projectId: import.meta.env.SANITY_PROJECT_ID || 'placeholder',
      dataset: import.meta.env.SANITY_DATASET || 'production',
      useCdn: false, // false for static builds per @sanity/astro docs
    }),
    react(),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
