import { defineType, defineField } from 'sanity';
import { pageVisibilityField } from '../fields/visibility';

export const resourcesPage = defineType({
  name: 'resourcesPage',
  title: 'Resources Page',
  type: 'document',
  fields: [
    pageVisibilityField,

    // ── Hero ──────────────────────────────────────────────────────────
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Use a wide image and set the hotspot around the visual focus; this image is cropped in the hero.',
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
                      title: 'External or Legacy URL',
                      type: 'url',
                      description:
                        'Use for an external article, website, or an existing PDF hosted elsewhere. For a new PDF, use the upload field below instead.',
                      validation: (rule) =>
                        rule.uri({
                          scheme: ['http', 'https', 'mailto'],
                          allowRelative: true,
                        }),
                    }),
                    defineField({
                      name: 'file',
                      title: 'PDF Upload',
                      type: 'file',
                      options: { accept: 'application/pdf' },
                      hidden: ({ parent }) => parent?.type !== 'pdf',
                      description:
                        'Upload a PDF for Sanity to host. An uploaded PDF takes precedence over the URL above.',
                      validation: (rule) =>
                        rule.custom((file, context) =>
                          context.parent?.type !== 'pdf' || file || context.parent?.url
                            ? true
                            : 'Upload a PDF or provide a URL.',
                        ),
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
