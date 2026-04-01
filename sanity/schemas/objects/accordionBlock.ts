import { defineType, defineField } from 'sanity';

export const accordionBlock = defineType({
  name: 'accordionBlock',
  title: 'Accordion Block',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'accordionItem',
          title: 'Accordion Item',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'content',
              title: 'Content',
              type: 'array',
              of: [{ type: 'block' }],
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
    select: { items: 'items' },
    prepare: ({ items }) => ({
      title: `Accordion (${items?.length ?? 0} items)`,
    }),
  },
});
