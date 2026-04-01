import { defineType, defineField } from 'sanity';

export const youtubeEmbedBlock = defineType({
  name: 'youtubeEmbedBlock',
  title: 'YouTube Embed Block',
  type: 'object',
  fields: [
    defineField({
      name: 'videoId',
      title: 'Video ID',
      type: 'string',
      description: 'The YouTube video ID (e.g. dQw4w9WgXcQ)',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
  ],
  preview: {
    select: { videoId: 'videoId', caption: 'caption' },
    prepare: ({ videoId, caption }) => ({
      title: caption || `YouTube: ${videoId ?? 'No ID'}`,
    }),
  },
});
