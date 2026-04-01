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
