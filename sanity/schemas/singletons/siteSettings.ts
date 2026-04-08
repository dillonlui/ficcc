import { defineType, defineField } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'churchName',
      title: 'Church Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'city',
      title: 'City, State ZIP',
      type: 'string',
      description: 'e.g. "Ithaca, NY 14850"',
    }),
    defineField({
      name: 'serviceTimes',
      title: 'Service Times',
      type: 'array',
      description: 'Centralized service times — pulled by footer, homepage, contact page, and visit page',
      of: [
        {
          type: 'object',
          name: 'serviceTime',
          title: 'Service Time',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'time', title: 'Time', type: 'string', validation: (rule) => rule.required() }),
          ],
          preview: { select: { title: 'label', subtitle: 'time' } },
        },
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'socialLink',
          title: 'Social Link',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: ['facebook', 'instagram', 'youtube', 'twitter', 'wechat'],
              },
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
            }),
          ],
          preview: {
            select: { title: 'platform', subtitle: 'url' },
          },
        },
      ],
    }),
    defineField({
      name: 'announcementBarEnabled',
      title: 'Announcement Bar Enabled',
      type: 'boolean',
      initialValue: false,
      description: 'Show the announcement banner at the top of every page',
    }),
    defineField({
      name: 'announcementBarText',
      title: 'Announcement Bar Text',
      type: 'string',
      description: 'Text to display in the announcement bar',
      hidden: ({ document }) => !document?.announcementBarEnabled,
    }),
    defineField({
      name: 'announcementBarLink',
      title: 'Announcement Bar Link',
      type: 'url',
      description: 'Optional link — the entire bar becomes clickable',
      hidden: ({ document }) => !document?.announcementBarEnabled,
      validation: (rule) =>
        rule.uri({ allowRelative: true, scheme: ['http', 'https'] }),
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
    select: { title: 'churchName', language: 'language' },
    prepare: ({ title, language }) => ({
      title: title || 'Site Settings',
      subtitle: language?.toUpperCase(),
    }),
  },
});
