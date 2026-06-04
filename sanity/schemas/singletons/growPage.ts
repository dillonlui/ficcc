import { defineType, defineField } from 'sanity';
import { pageVisibilityField } from '../fields/visibility';

const audiences = [
  { title: 'English Ministry', value: 'english' },
  { title: 'Chinese Ministry', value: 'chinese' },
  { title: 'Youth Ministry', value: 'youth' },
  { title: 'Children\'s Ministry', value: 'children' },
];

export const growPage = defineType({
  name: 'growPage',
  title: 'Grow Page',
  type: 'document',
  fields: [
    pageVisibilityField,
    defineField({
      name: 'audience',
      title: 'Audience',
      type: 'string',
      options: { list: audiences, layout: 'radio' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: { list: ['en', 'zh'] },
      initialValue: 'en',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'SEO Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'SEO Description',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'navLabel',
      title: 'Navigation Label',
      type: 'string',
      description: 'Short label used in Grow navigation menus.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'pageTitle',
      title: 'Page Title',
      type: 'string',
      validation: (rule) => rule.required(),
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
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Leave blank to use the built-in page fallback image.',
    }),
    defineField({
      name: 'intro',
      title: 'Intro Text',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'listingHeading',
      title: 'Listing Heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'groups',
      title: 'Groups / Classes',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'growGroup',
          title: 'Group',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'meetingTime',
              title: 'Meeting Time',
              type: 'string',
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
            }),
            defineField({
              name: 'imageAlt',
              title: 'Image Alt Text',
              type: 'string',
              description: 'Describe meaningful images. Leave blank only if decorative.',
            }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'meetingTime', media: 'image' },
          },
        },
      ],
      validation: (rule) => rule.min(1).required(),
    }),
    defineField({
      name: 'sermonsCalloutHeading',
      title: 'Sermons Callout Heading',
      type: 'string',
    }),
    defineField({
      name: 'sermonsCalloutBody',
      title: 'Sermons Callout Body',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'sermonsCtaText',
      title: 'Sermons CTA Text',
      type: 'string',
    }),
    defineField({
      name: 'sermonsCtaHref',
      title: 'Sermons CTA Link',
      type: 'string',
      description: 'Use a site path like /en/sermons or /zh/sermons.',
    }),
  ],
  preview: {
    select: { title: 'pageTitle', audience: 'audience', language: 'language' },
    prepare: ({ title, audience, language }) => ({
      title: title || 'Grow Page',
      subtitle: [audience, language?.toUpperCase()].filter(Boolean).join(' · '),
    }),
  },
});
