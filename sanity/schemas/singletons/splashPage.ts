import { defineType, defineField } from 'sanity';

export const splashPage = defineType({
  name: 'splashPage',
  title: 'Splash Page',
  type: 'document',
  fields: [
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Full-screen background image (waterfall photo)',
    }),
    defineField({
      name: 'churchNameEn',
      title: 'Church Name (English)',
      type: 'string',
      initialValue: 'First Ithaca Chinese Christian Church',
    }),
    defineField({
      name: 'churchNameZh',
      title: 'Church Name (Chinese)',
      type: 'string',
      initialValue: '以撒迦中华基督教会',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Splash Page' }),
  },
});
