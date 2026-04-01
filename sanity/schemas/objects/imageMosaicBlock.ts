import { defineType, defineField } from 'sanity';

export const imageMosaicBlock = defineType({
  name: 'imageMosaicBlock',
  title: 'Image Mosaic Block',
  type: 'object',
  fields: [
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
          ],
        },
      ],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: { images: 'images' },
    prepare: ({ images }) => ({
      title: `Image Mosaic (${images?.length ?? 0} images)`,
    }),
  },
});
