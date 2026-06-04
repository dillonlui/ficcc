import { defineField } from 'sanity';

export const pageVisibilityField = defineField({
  name: 'isVisible',
  title: 'Publicly Visible',
  type: 'boolean',
  initialValue: true,
  description:
    'Turn this off to hide the public page on the next site rebuild while keeping the content in Sanity.',
});

export const documentVisibilityField = defineField({
  name: 'isVisible',
  title: 'Publicly Visible',
  type: 'boolean',
  initialValue: true,
  description:
    'Turn this off to hide this item from public lists and pages on the next site rebuild.',
});
