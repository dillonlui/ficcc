import { defineType, defineField } from 'sanity';
import { documentVisibilityField } from '../fields/visibility';

export const sermon = defineType({
  name: 'sermon',
  title: 'Sermon',
  type: 'document',
  fields: [
    documentVisibilityField,

    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'speaker',
      title: 'Speaker',
      type: 'string',
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (rule) => rule.required().warning('Add the sermon date so it can be ordered correctly.'),
    }),
    defineField({
      name: 'series',
      title: 'Series',
      type: 'string',
    }),
    defineField({
      name: 'scripture',
      title: 'Scripture Reference',
      type: 'string',
    }),
    defineField({
      name: 'videoId',
      title: 'YouTube Video ID',
      type: 'string',
      description: 'YouTube video ID only (e.g. dQw4w9WgXcQ), not the full URL. Paste the 11-character ID after v=.',
      validation: (rule) =>
        rule.regex(/^[A-Za-z0-9_-]{11}$/).warning('Use an 11-character YouTube video ID, not a full URL.'),
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: { list: ['en', 'zh'] },
      initialValue: 'en',
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    { title: 'Date (Newest)', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'speaker', language: 'language', date: 'date' },
    prepare: ({ title, subtitle, language, date }) => ({
      title: title || 'Untitled Sermon',
      subtitle: [subtitle, date, language?.toUpperCase()].filter(Boolean).join(' · '),
    }),
  },
});
