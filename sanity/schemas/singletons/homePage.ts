import { defineType, defineField } from 'sanity';
import { pageVisibilityField } from '../fields/visibility';

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    pageVisibilityField,

    // ── Hero ──────────────────────────────────────────────────────────
    defineField({
      name: 'heroMediaType',
      title: 'Hero Media Type',
      type: 'string',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'radio',
      },
      initialValue: 'image',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image / Video Poster Fallback',
      type: 'image',
      options: { hotspot: true },
      description:
        'Optional. Leave blank to use the built-in FICCC hero poster image. Also used as the poster/fallback image when the hero uses video.',
    }),
    defineField({
      name: 'heroFallbackImage',
      title: 'Video Failure Fallback Image',
      type: 'image',
      options: { hotspot: true },
      description:
        'Optional image shown as the video poster/fallback if the uploaded video cannot load. Leave blank to reuse the Hero Image.',
      hidden: ({ parent }) => parent?.heroMediaType !== 'video',
    }),
    defineField({
      name: 'heroVideo',
      title: 'Hero Video',
      type: 'file',
      description:
        'Optional. Leave blank to use the built-in FICCC hero video. Upload only an optimized, muted-friendly MP4/WebM if replacing it.',
      hidden: ({ parent }) => parent?.heroMediaType !== 'video',
      options: {
        accept: 'video/mp4,video/webm,video/quicktime',
      },
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
      description: 'Use a site path such as /en/visit, or a full https:// URL.',
      validation: (rule) => rule.custom((value) =>
        !value || /^(\/|https:\/\/)/.test(value)
          ? true
          : 'Use a site path beginning with / or a full https:// URL.',
      ),
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
            defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true }, description: 'Use a landscape image and set its hotspot around the visual focus.' }),
            defineField({
              name: 'imageAlt',
              title: 'Image Alt Text',
              type: 'string',
              description: 'Describe the image for screen readers. Leave blank only if the image is decorative.',
              validation: (rule) => rule.custom((value, context) =>
                !context.parent?.image || value
                  ? true
                  : 'Add alt text, or remove the image if it is not meaningful content.',
              ).warning(),
            }),
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
          preview: { select: { title: 'heading', subtitle: 'layout', media: 'image' } },
        },
      ],
    }),

    // ── Bridging Cultures Banner ─────────────────────────────────────
    defineField({ name: 'bannerHeading', title: 'Banner Heading', type: 'string' }),
    defineField({ name: 'bannerBody', title: 'Banner Body', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'bannerImage', title: 'Banner Image', type: 'image', options: { hotspot: true }, description: 'Use a wide image and set the hotspot around the visual focus.' }),
    defineField({
      name: 'bannerImageAlt',
      title: 'Banner Image Alt Text',
      type: 'string',
      description: 'Describe the banner image for screen readers. Leave blank only if the image is decorative.',
      validation: (rule) => rule.custom((value, context) =>
        !context.parent?.bannerImage || value
          ? true
          : 'Add alt text, or remove the banner image if it is decorative.',
      ).warning(),
    }),
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
