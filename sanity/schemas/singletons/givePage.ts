import { defineType, defineField } from 'sanity';

export const givePage = defineType({
  name: 'givePage',
  title: 'Give',
  type: 'document',
  fields: [
    defineField({ name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'heroTitle', title: 'Hero Title', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'heroSubtitle', title: 'Hero Subtitle', type: 'string' }),
    defineField({ name: 'whyWeGiveHeading', title: 'Why We Give Heading', type: 'string', initialValue: 'Why We Give' }),
    defineField({ name: 'whyWeGiveBody', title: 'Why We Give Body', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'scriptureQuote', title: 'Scripture Quote', type: 'text', rows: 3 }),
    defineField({ name: 'scriptureCitation', title: 'Scripture Citation', type: 'string' }),
    defineField({
      name: 'givingMethods',
      title: 'Giving Methods',
      type: 'array',
      of: [{
        type: 'object', name: 'givingMethod', title: 'Giving Method',
        fields: [
          defineField({ name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required() }),
          defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
          defineField({ name: 'icon', title: 'Icon', type: 'string', options: { list: ['globe', 'envelope', 'people'] } }),
          defineField({ name: 'link', title: 'Link URL', type: 'url', validation: (rule) => rule.uri({ allowRelative: false, scheme: ['http', 'https'] }) }),
          defineField({ name: 'linkText', title: 'Link Button Text', type: 'string' }),
          defineField({ name: 'note', title: 'Note', type: 'string', description: 'e.g. "Sundays at 11:15 AM"' }),
          defineField({ name: 'address', title: 'Mailing Address', type: 'text', rows: 3 }),
        ],
        preview: { select: { title: 'title', subtitle: 'icon' } },
      }],
    }),
    defineField({ name: 'questionsHeading', title: 'Questions Heading', type: 'string', initialValue: 'Questions?' }),
    defineField({ name: 'questionsBody', title: 'Questions Body', type: 'text', rows: 3 }),
    defineField({
      name: 'language', title: 'Language', type: 'string',
      options: { list: ['en', 'zh'] }, initialValue: 'en',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { language: 'language' },
    prepare: ({ language }) => ({ title: 'Give', subtitle: language?.toUpperCase() }),
  },
});
