import { defineType, defineField } from 'sanity';

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    // ── Who We Are ─────────────────────────────────────────────────
    defineField({ name: 'whoWeAreHeading', title: 'Heading', type: 'string', initialValue: 'Who We Are' }),
    defineField({ name: 'whoWeAreBody', title: 'Body', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'whoWeAreImage', title: 'Image', type: 'image', options: { hotspot: true } }),

    // ── Snapshots ─────────────────────────────────────────────────
    defineField({
      name: 'snapshots',
      title: 'Snapshots',
      description: 'Stats like "40+ years in Ithaca"',
      type: 'array',
      of: [{
        type: 'object', name: 'snapshot', title: 'Snapshot',
        fields: [
          defineField({ name: 'accent', title: 'Accent Text', type: 'string', validation: (rule) => rule.required() }),
          defineField({ name: 'body', title: 'Body', type: 'string' }),
        ],
        preview: { select: { title: 'accent', subtitle: 'body' } },
      }],
    }),

    // ── Pastors ───────────────────────────────────────────────────
    defineField({
      name: 'pastors',
      title: 'Pastors',
      type: 'array',
      of: [{
        type: 'object', name: 'pastor', title: 'Pastor',
        fields: [
          defineField({ name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required() }),
          defineField({ name: 'role', title: 'Role', type: 'string' }),
          defineField({ name: 'bio', title: 'Bio', type: 'array', of: [{ type: 'block' }] }),
          defineField({ name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } }),
        ],
        preview: { select: { title: 'name', subtitle: 'role', media: 'photo' } },
      }],
    }),

    // ── Timeline ──────────────────────────────────────────────────
    defineField({ name: 'timelineHeading', title: 'Timeline Heading', type: 'string', initialValue: 'Our Story' }),
    defineField({
      name: 'timelineEras',
      title: 'Timeline Eras',
      type: 'array',
      of: [{
        type: 'object', name: 'timelineEra', title: 'Era',
        fields: [
          defineField({ name: 'title', title: 'Era Title', type: 'string', validation: (rule) => rule.required() }),
          defineField({
            name: 'entries',
            title: 'Entries',
            type: 'array',
            of: [{
              type: 'object', name: 'timelineEntry', title: 'Entry',
              fields: [
                defineField({ name: 'year', title: 'Year', type: 'string', validation: (rule) => rule.required() }),
                defineField({ name: 'description', title: 'Description', type: 'string', validation: (rule) => rule.required() }),
              ],
              preview: { select: { title: 'year', subtitle: 'description' } },
            }],
          }),
        ],
        preview: { select: { title: 'title' } },
      }],
    }),

    // ── Beliefs Callout ───────────────────────────────────────────
    defineField({ name: 'beliefsCalloutHeading', title: 'Beliefs Callout Heading', type: 'string', initialValue: 'What do we believe?' }),
    defineField({ name: 'beliefsCalloutBody', title: 'Beliefs Callout Body', type: 'string' }),

    // ── Language ───────────────────────────────────────────────────
    defineField({
      name: 'language', title: 'Language', type: 'string',
      options: { list: ['en', 'zh'] }, initialValue: 'en',
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
