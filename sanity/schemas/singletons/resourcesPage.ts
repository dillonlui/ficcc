import { defineType, defineField } from 'sanity';

export const resourcesPage = defineType({
  name: 'resourcesPage',
  title: 'Resources Page',
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

    // ── Resource Categories ──────────────────────────────────────────
    defineField({
      name: 'resourceCategories',
      title: 'Resource Categories',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'resourceCategory',
          title: 'Resource Category',
          fields: [
            defineField({
              name: 'title',
              title: 'Category Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Category Description',
              type: 'string',
            }),
            defineField({
              name: 'resources',
              title: 'Resources',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'resourceItem',
                  title: 'Resource Item',
                  fields: [
                    defineField({
                      name: 'title',
                      title: 'Title',
                      type: 'string',
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: 'url',
                      title: 'URL',
                      type: 'url',
                      validation: (rule) =>
                        rule.uri({
                          scheme: ['http', 'https', 'mailto'],
                          allowRelative: true,
                        }),
                    }),
                    defineField({
                      name: 'description',
                      title: 'Description',
                      type: 'string',
                    }),
                    defineField({
                      name: 'type',
                      title: 'Resource Type',
                      type: 'string',
                      options: {
                        list: [
                          { title: 'Article', value: 'article' },
                          { title: 'PDF Download', value: 'pdf' },
                          { title: 'External Link', value: 'link' },
                        ],
                      },
                      initialValue: 'article',
                    }),
                  ],
                  preview: {
                    select: { title: 'title', subtitle: 'type' },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: { title: 'title' },
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
      title: 'Resources Page',
      subtitle: language?.toUpperCase(),
    }),
  },
});
