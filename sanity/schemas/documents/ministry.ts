import { defineType, defineField } from 'sanity';

export const ministry = defineType({
  name: 'ministry',
  title: 'Ministry',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'leader',
      title: 'Leader',
      type: 'reference',
      to: [{ type: 'person' }],
    }),
    defineField({
      name: 'meetingTime',
      title: 'Meeting Time',
      type: 'string',
      description: 'Human-readable meeting schedule (e.g. "Fridays 7:00 PM")',
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
  preview: {
    select: { title: 'name', language: 'language' },
    prepare: ({ title, language }) => ({
      title: title || 'Unnamed Ministry',
      subtitle: language?.toUpperCase(),
    }),
  },
});
