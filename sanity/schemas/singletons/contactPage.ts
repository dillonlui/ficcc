import { defineType, defineField } from 'sanity';

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact',
  type: 'document',
  fields: [
    defineField({ name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'heroTitle', title: 'Hero Title', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'heroSubtitle', title: 'Hero Subtitle', type: 'string' }),
    defineField({
      name: 'formEnabled', title: 'Contact Form Enabled', type: 'boolean',
      initialValue: true, description: 'Toggle the contact form on/off',
    }),
    defineField({
      name: 'language', title: 'Language', type: 'string',
      options: { list: ['en', 'zh'] }, initialValue: 'en',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { language: 'language' },
    prepare: ({ language }) => ({ title: 'Contact', subtitle: language?.toUpperCase() }),
  },
});
