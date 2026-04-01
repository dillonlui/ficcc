import { defineType, defineField } from 'sanity';

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    // ── Who We Are ─────────────────────────────────────────────────
    defineField({
      name: 'whoWeAreHeading',
      title: 'Who We Are Heading',
      type: 'string',
      initialValue: 'Who We Are',
    }),
    defineField({
      name: 'whoWeAreBody',
      title: 'Who We Are Body',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'whoWeAreImage',
      title: 'Who We Are Image',
      type: 'image',
      options: { hotspot: true },
    }),

    // ── Vision Statement ──────────────────────────────────────────
    defineField({
      name: 'visionHeading',
      title: 'Vision Heading',
      type: 'string',
      initialValue: 'Our Vision',
    }),
    defineField({
      name: 'visionBody',
      title: 'Vision Body',
      type: 'array',
      of: [{ type: 'block' }],
    }),

    // ── Church Stats ──────────────────────────────────────────────
    defineField({
      name: 'churchStats',
      title: 'Church Stats',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'statItem',
          title: 'Stat',
          fields: [
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: 'value', subtitle: 'label' },
          },
        },
      ],
    }),

    // ── Beliefs ────────────────────────────────────────────────────
    defineField({
      name: 'beliefs',
      title: 'Beliefs',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'beliefItem',
          title: 'Belief',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'content',
              title: 'Content',
              type: 'array',
              of: [{ type: 'block' }],
            }),
          ],
          preview: {
            select: { title: 'title' },
          },
        },
      ],
    }),

    // ── Staff Ordering ─────────────────────────────────────────────
    defineField({
      name: 'staffOrder',
      title: 'Staff Order',
      description: 'Drag to reorder staff members on the About page',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'person' }],
        },
      ],
    }),

    // ── Language ───────────────────────────────────────────────────
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
      title: 'About Page',
      subtitle: language?.toUpperCase(),
    }),
  },
});
