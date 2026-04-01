import { defineType, defineField } from 'sanity';

export const sermon = defineType({
  name: 'sermon',
  title: 'Sermon',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
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
      description: 'YouTube video ID only (e.g. dQw4w9WgXcQ), not the full URL',
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
