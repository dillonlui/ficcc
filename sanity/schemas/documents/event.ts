import { defineType, defineField } from 'sanity';
import { documentVisibilityField } from '../fields/visibility';

export const event = defineType({
  name: 'event',
  title: 'Event',
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
      title: 'Page URL',
      type: 'slug',
      options: { source: 'title' },
      description: 'Generate this from the title. It becomes the event landing-page URL.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Short Summary',
      type: 'text',
      rows: 3,
      description: 'A short invitation shown on the homepage and near the top of the event page.',
      validation: (rule) => rule.max(240).warning('Keep the summary under 240 characters.'),
    }),
    defineField({
      name: 'date',
      title: 'Start Date',
      type: 'datetime',
      description: 'Required. The event automatically leaves the homepage after its final date.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'datetime',
      description: 'Optional. Use for a multi-day event or an event with a precise ending time.',
      validation: (rule) => rule.custom((value, context) => {
        const start = context.document?.date as string | undefined;
        return !value || !start || new Date(value) >= new Date(start)
          ? true
          : 'End Date must be after Start Date.';
      }),
    }),
    defineField({
      name: 'time',
      title: 'Time Description',
      type: 'string',
      description: 'Human-readable time (e.g. "Sundays 10:00 AM")',
    }),
    defineField({
      name: 'location',
      title: 'Location Name',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
      description: 'Optional street address shown separately from the location name.',
    }),
    defineField({
      name: 'mapUrl',
      title: 'Map Link',
      type: 'url',
      description: 'Optional Google Maps, Apple Maps, or other https:// link.',
      validation: (rule) => rule.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'image',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Use a landscape image with the important subject near the center. The site crops this image at different sizes.',
    }),
    defineField({
      name: 'imageAlt',
      title: 'Image Alt Text',
      type: 'string',
      description: 'Briefly describe the image for people using screen readers.',
      validation: (rule) => rule.custom((value, context) =>
        !context.document?.image || value
          ? true
          : 'Add alt text, or remove the image if it is decorative.',
      ).warning(),
    }),
    defineField({
      name: 'recurrence',
      title: 'Repeats',
      type: 'string',
      options: {
        list: [
          { title: 'Does not repeat', value: 'none' },
          { title: 'Weekly', value: 'weekly' },
          { title: 'Monthly', value: 'monthly' },
          { title: 'Yearly', value: 'yearly' },
        ],
        layout: 'radio',
      },
      initialValue: 'none',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'recurrenceEndDate',
      title: 'Final Occurrence Date',
      type: 'date',
      description: 'Required for repeating events so they cannot remain on the homepage forever.',
      hidden: ({ document }) => !document?.recurrence || document.recurrence === 'none',
      validation: (rule) => rule.custom((value, context) => {
        const recurrence = context.document?.recurrence;
        const start = context.document?.date as string | undefined;
        if (recurrence && recurrence !== 'none' && !value) {
          return 'Add a final occurrence date for this repeating event.';
        }
        if (!value || !start) return true;
        return value >= start.slice(0, 10)
          ? true
          : 'Final Occurrence Date must be on or after Start Date.';
      }),
    }),
    defineField({
      name: 'registrationLabel',
      title: 'Action Button Label',
      type: 'string',
      description: 'Optional, for example “Register” or “Learn more”.',
    }),
    defineField({
      name: 'registrationUrl',
      title: 'Action Button Link',
      type: 'url',
      validation: (rule) => rule.uri({ scheme: ['https', 'mailto'] }).custom((value, context) =>
        !context.document?.registrationLabel || value
          ? true
          : 'Add a link for the action button.',
      ),
    }),
    defineField({
      name: 'contactName',
      title: 'Contact Name',
      type: 'string',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'email',
    }),
    defineField({
      name: 'translation',
      title: 'Other-Language Version',
      type: 'reference',
      to: [{ type: 'event' }],
      description: 'Optional. Connect the separately authored English or Chinese version of this event.',
      options: {
        filter: ({ document }) => ({
          filter: '_type == "event" && language != $language',
          params: { language: document.language || 'en' },
        }),
      },
    }),
    defineField({
      name: 'recurring',
      title: 'Legacy Recurring Setting',
      type: 'boolean',
      hidden: true,
      description: 'Retained only so older event documents remain compatible.',
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
    { title: 'Date (Soonest)', name: 'dateAsc', by: [{ field: 'date', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', date: 'date', language: 'language', recurrence: 'recurrence', media: 'image' },
    prepare: ({ title, date, language, recurrence, media }) => ({
      title: title || 'Untitled Event',
      subtitle: [date?.slice(0, 10), recurrence && recurrence !== 'none' ? recurrence : null, language?.toUpperCase()]
        .filter(Boolean)
        .join(' · '),
      media,
    }),
  },
});
