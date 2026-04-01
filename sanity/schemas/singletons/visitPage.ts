import { defineType, defineField } from 'sanity';

export const visitPage = defineType({
  name: 'visitPage',
  title: 'Visit Page',
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

    // ── What to Expect ───────────────────────────────────────────────
    defineField({
      name: 'whatToExpect',
      title: 'What to Expect',
      type: 'array',
      of: [{ type: 'block' }],
    }),

    // ── Sunday Schedule ──────────────────────────────────────────────
    defineField({
      name: 'schedule',
      title: 'Sunday Schedule',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'scheduleItem',
          title: 'Schedule Item',
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
            defineField({
              name: 'description',
              title: 'Description',
              type: 'string',
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'time' },
          },
        },
      ],
    }),

    // ── Transportation / Directions ──────────────────────────────────
    defineField({
      name: 'transportation',
      title: 'Transportation & Directions',
      type: 'array',
      of: [{ type: 'block' }],
    }),

    // ── FAQ ──────────────────────────────────────────────────────────
    defineField({
      name: 'faqItems',
      title: 'FAQ Items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'faqItem',
          title: 'FAQ Item',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: 'question' },
          },
        },
      ],
    }),

    // ── Ride Request ─────────────────────────────────────────────────
    defineField({
      name: 'rideRequestEnabled',
      title: 'Ride Request Enabled',
      type: 'boolean',
      initialValue: true,
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
      title: 'Visit Page',
      subtitle: language?.toUpperCase(),
    }),
  },
});
