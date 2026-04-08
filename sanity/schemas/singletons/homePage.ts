import { defineType, defineField } from 'sanity';

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    // ── Hero ──────────────────────────────────────────────────────────
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'heroCtaText',
      title: 'Hero CTA Text',
      type: 'string',
    }),
    defineField({
      name: 'heroCtaHref',
      title: 'Hero CTA Link',
      type: 'string',
    }),

    // ── Content Sections (Go Deeper, Sunday Mornings, Find Community, Watch Sermons) ──
    defineField({
      name: 'sections',
      title: 'Content Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'homeSection',
          title: 'Section',
          fields: [
            defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'body', title: 'Body', type: 'array', of: [{ type: 'block' }] }),
            defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'ctaText', title: 'CTA Text', type: 'string' }),
            defineField({ name: 'ctaHref', title: 'CTA Link', type: 'string' }),
            defineField({
              name: 'layout',
              title: 'Layout',
              type: 'string',
              options: { list: ['default', 'reversed'] },
              initialValue: 'default',
            }),
            defineField({ name: 'tinted', title: 'Tinted Background', type: 'boolean', initialValue: false }),
          ],
          preview: { select: { title: 'heading', subtitle: 'layout' } },
        },
      ],
    }),

    // ── Bridging Cultures Banner ─────────────────────────────────────
    defineField({ name: 'bannerHeading', title: 'Banner Heading', type: 'string' }),
    defineField({ name: 'bannerBody', title: 'Banner Body', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'bannerImage', title: 'Banner Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'bannerCtaText', title: 'Banner CTA Text', type: 'string' }),
    defineField({ name: 'bannerCtaHref', title: 'Banner CTA Link', type: 'string' }),

    // ── Language ──────────────────────────────────────────────────────
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: { list: ['en', 'zh'] },
      initialValue: 'en',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { language: 'language' },
    prepare: ({ language }) => ({
      title: 'Home Page',
      subtitle: language?.toUpperCase(),
    }),
  },
});
