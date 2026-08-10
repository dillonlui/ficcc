import { defineType, defineField } from 'sanity';

const svgLogoField = (name: string, title: string, description: string) =>
  defineField({
    name,
    title,
    type: 'file',
    options: { accept: 'image/svg+xml' },
    description: `${description} Upload an SVG with a transparent background. Leave blank to use the built-in fallback.`,
  });

export const siteBranding = defineType({
  name: 'siteBranding',
  title: 'Site Branding',
  type: 'document',
  fields: [
    svgLogoField('splashLogo', 'Splash Logo Mark', 'Circular mark shown on the language-selection splash page and 404 page.'),
    svgLogoField('headerLogoEn', 'Header Logo (English)', 'Wordmark shown in the English site header.'),
    svgLogoField('headerLogoZh', 'Header Logo (Chinese)', 'Wordmark shown in the Chinese site header.'),
    svgLogoField('footerLogo', 'Footer Logo (Bilingual)', 'Bilingual wordmark shown in both site footers.'),
  ],
  preview: {
    prepare: () => ({ title: 'Site Branding' }),
  },
});
