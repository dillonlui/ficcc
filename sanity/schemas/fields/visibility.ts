import { defineField } from 'sanity';

export const pageVisibilityField = defineField({
  name: 'isVisible',
  title: 'Publicly Visible',
  type: 'boolean',
  initialValue: true,
  description:
    'Turn this off to hide the public page while keeping the document editable in Sanity.',
  validation: (rule) => rule.required().error('Choose whether this page is publicly visible.'),
});

export const documentVisibilityField = defineField({
  name: 'isVisible',
  title: 'Publicly Visible',
  type: 'boolean',
  initialValue: true,
  description:
    'Turn this off to hide this item from public lists and pages while keeping it editable in Sanity.',
  validation: (rule) => rule.required().error('Choose whether this item is publicly visible.'),
});
