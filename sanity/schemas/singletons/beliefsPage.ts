import { defineType, defineField } from 'sanity';

export const beliefsPage = defineType({
  name: 'beliefsPage',
  title: 'Beliefs & Vision',
  type: 'document',
  fields: [
    defineField({ name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'heroTitle', title: 'Hero Title', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'heroSubtitle', title: 'Hero Subtitle', type: 'string' }),
    defineField({ name: 'beliefsHeading', title: 'Beliefs Section Heading', type: 'string', initialValue: 'What We Believe' }),
    defineField({ name: 'beliefsIntro', title: 'Beliefs Intro', type: 'text', rows: 3 }),
    defineField({
      name: 'beliefs',
      title: 'Beliefs',
      type: 'array',
      of: [{
        type: 'object', name: 'beliefItem', title: 'Belief',
        fields: [
          defineField({ name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required() }),
          defineField({ name: 'content', title: 'Content', type: 'array', of: [{ type: 'block' }] }),
        ],
        preview: { select: { title: 'title' } },
      }],
    }),
    defineField({ name: 'scriptureQuote', title: 'Scripture Quote', type: 'text', rows: 3, description: 'Quote text for the scripture banner between sections' }),
    defineField({ name: 'scriptureCitation', title: 'Scripture Citation', type: 'string', description: 'e.g. "2 Timothy 3:16-17"' }),
    defineField({ name: 'scriptureImage', title: 'Scripture Banner Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'visionHeading', title: 'Vision Section Heading', type: 'string', initialValue: 'Our Vision' }),
    defineField({ name: 'visionIntro', title: 'Vision Intro', type: 'array', of: [{ type: 'block' }] }),
    defineField({
      name: 'visionItems',
      title: 'Vision Items',
      type: 'array',
      of: [{
        type: 'object', name: 'visionItem', title: 'Vision Item',
        fields: [
          defineField({ name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required() }),
          defineField({ name: 'content', title: 'Content', type: 'array', of: [{ type: 'block' }] }),
        ],
        preview: { select: { title: 'title' } },
      }],
    }),
    defineField({ name: 'calloutHeading', title: 'Callout Heading', type: 'string', initialValue: 'See our faith in action' }),
    defineField({ name: 'calloutBody', title: 'Callout Body', type: 'string' }),
    defineField({
      name: 'language', title: 'Language', type: 'string',
      options: { list: ['en', 'zh'] }, initialValue: 'en',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { language: 'language' },
    prepare: ({ language }) => ({ title: 'Beliefs & Vision', subtitle: language?.toUpperCase() }),
  },
});
