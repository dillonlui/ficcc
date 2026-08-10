import { defineType, defineField } from 'sanity';
import { darkLogoFileInput, lightLogoFileInput, splashLogoFileInput } from '../../components/LogoFileInput';

const svgLogoField = (
  name: string,
  title: string,
  description: string,
  previewTone: 'light' | 'dark' | 'splash',
) =>
  defineField({
    name,
    title,
    type: 'file',
    options: { accept: 'image/svg+xml' },
    description: `${description} Upload an SVG with a transparent background. Leave blank to use the built-in fallback.`,
    components: {
      input: previewTone === 'splash'
        ? splashLogoFileInput
        : previewTone === 'dark'
          ? darkLogoFileInput
          : lightLogoFileInput,
    },
  });

export const siteBranding = defineType({
  name: 'siteBranding',
  title: 'Site Branding',
  type: 'document',
  fields: [
    svgLogoField('splashLogo', 'Splash Logo Mark', 'Circular mark shown on the language-selection splash page and 404 page.', 'splash'),
    svgLogoField('headerLogoEn', 'Header Logo (English)', 'Wordmark shown in the English site header.', 'light'),
    svgLogoField('headerLogoZh', 'Header Logo (Chinese)', 'Wordmark shown in the Chinese site header.', 'light'),
    svgLogoField('footerLogo', 'Footer Logo (Bilingual)', 'Bilingual wordmark shown in both site footers.', 'dark'),
  ],
  preview: {
    prepare: () => ({ title: 'Site Branding' }),
  },
});
