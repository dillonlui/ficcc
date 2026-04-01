import { defineType, defineField } from 'sanity';

export const cardGridBlock = defineType({
  name: 'cardGridBlock',
  title: 'Card Grid Block',
  type: 'object',
  fields: [
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'card',
          title: 'Card',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'string',
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
            }),
            defineField({
              name: 'link',
              title: 'Link',
              type: 'string',
            }),
          ],
          preview: {
            select: { title: 'title' },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { cards: 'cards' },
    prepare: ({ cards }) => ({
      title: `Card Grid (${cards?.length ?? 0} cards)`,
    }),
  },
});
