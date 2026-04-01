import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import sanity from '@sanity/astro';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://ficcc.org',
  // Astro 5 removed output:'hybrid' — static + adapter is the equivalent,
  // enabling per-page SSR opt-in via `export const prerender = false`.
  output: 'static', // hybrid equivalent with adapter
  adapter: vercel(),
  integrations: [
    sitemap(),
    sanity({
      projectId: import.meta.env.SANITY_PROJECT_ID || 'placeholder',
      dataset: import.meta.env.SANITY_DATASET || 'production',
      useCdn: false, // false for static builds per @sanity/astro docs
      stega: {
        studioUrl: import.meta.env.PUBLIC_SANITY_PREVIEW_URL || 'http://localhost:3333',
      },
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
