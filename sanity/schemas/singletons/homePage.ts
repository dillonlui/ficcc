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

    // ── Service Times ────────────────────────────────────────────────
    defineField({
      name: 'serviceTimes',
      title: 'Service Times',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'serviceTime',
          title: 'Service Time',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'time',
              title: 'Time',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'time' },
          },
        },
      ],
    }),

    // ── Photo Mosaic ─────────────────────────────────────────────────
    defineField({
      name: 'mosaicImages',
      title: 'Mosaic Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            }),
          ],
        },
      ],
    }),

    // ── Pillars ──────────────────────────────────────────────────────
    defineField({
      name: 'pillars',
      title: 'Pillars',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'pillar',
          title: 'Pillar',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
            }),
          ],
          preview: {
            select: { title: 'title' },
          },
        },
      ],
    }),

    // ── Next Steps ───────────────────────────────────────────────────
    defineField({
      name: 'nextSteps',
      title: 'Next Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'nextStep',
          title: 'Next Step',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'body',
              title: 'Body',
              type: 'string',
            }),
            defineField({
              name: 'href',
              title: 'Link',
              type: 'string',
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'href' },
          },
        },
      ],
    }),

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
