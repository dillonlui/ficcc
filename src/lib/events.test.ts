import { describe, expect, it } from 'vitest';
import {
  formatEventDate,
  getEventOccurrence,
  getRecurrenceLabel,
  getUpcomingEvents,
  isEventEnded,
} from './events';
import type { Event } from './sanity';

function event(overrides: Partial<Event> = {}): Event {
  return {
    _id: 'event-1',
    _type: 'event',
    title: 'Church Picnic',
    slug: { _type: 'slug', current: 'church-picnic' },
    date: '2026-07-15T16:00:00.000Z',
    language: 'en',
    recurrence: 'none',
    ...overrides,
  };
}

describe('event lifecycle', () => {
  it('keeps a one-time event active through its New York calendar date', () => {
    expect(getEventOccurrence(event(), new Date('2026-07-16T03:30:00.000Z'))).not.toBeNull();
    expect(isEventEnded(event(), new Date('2026-07-16T04:30:00.000Z'))).toBe(true);
  });

  it('keeps a multi-day event active through its end date', () => {
    const multiDay = event({ endDate: '2026-07-18T20:00:00.000Z' });
    expect(getEventOccurrence(multiDay, new Date('2026-07-18T15:00:00.000Z'))?.isOngoing).toBe(true);
    expect(isEventEnded(multiDay, new Date('2026-07-19T15:00:00.000Z'))).toBe(true);
  });

  it('requires a slug, date, and public visibility for homepage discovery', () => {
    expect(getEventOccurrence(event({ slug: undefined }))).toBeNull();
    expect(getEventOccurrence(event({ date: undefined }))).toBeNull();
    expect(getEventOccurrence(event({ isVisible: false }))).toBeNull();
  });

  it('calculates weekly occurrences and stops at the final occurrence', () => {
    const weekly = event({
      date: '2026-07-01T23:00:00.000Z',
      recurrence: 'weekly',
      recurrenceEndDate: '2026-07-29',
    });

    expect(getEventOccurrence(weekly, new Date('2026-07-15T12:00:00.000Z'))?.nextOccurrenceDate)
      .toBe('2026-07-15');
    expect(isEventEnded(weekly, new Date('2026-07-30T16:00:00.000Z'))).toBe(true);
  });

  it('uses the last valid day for monthly events anchored near month end', () => {
    const monthly = event({
      date: '2027-01-31T17:00:00.000Z',
      recurrence: 'monthly',
      recurrenceEndDate: '2027-05-31',
    });

    expect(getEventOccurrence(monthly, new Date('2027-02-15T16:00:00.000Z'))?.nextOccurrenceDate)
      .toBe('2027-02-28');
    expect(getEventOccurrence(monthly, new Date('2027-03-01T16:00:00.000Z'))?.nextOccurrenceDate)
      .toBe('2027-03-31');
  });

  it('handles yearly leap-day recurrence safely', () => {
    const yearly = event({
      date: '2028-02-29T17:00:00.000Z',
      recurrence: 'yearly',
      recurrenceEndDate: '2032-02-29',
    });

    expect(getEventOccurrence(yearly, new Date('2029-02-01T16:00:00.000Z'))?.nextOccurrenceDate)
      .toBe('2029-02-28');
  });

  it('does not let incomplete recurrence settings create a never-ending event', () => {
    const incomplete = event({ recurrence: 'weekly', recurrenceEndDate: undefined });
    expect(isEventEnded(incomplete, new Date('2026-07-20T16:00:00.000Z'))).toBe(true);
  });

  it('sorts every active event by its next occurrence without applying a display cap', () => {
    const events = [
      event({ _id: '3', title: 'Third', slug: { _type: 'slug', current: 'third' }, date: '2026-08-03T16:00:00Z' }),
      event({ _id: '1', title: 'First', slug: { _type: 'slug', current: 'first' }, date: '2026-08-01T16:00:00Z' }),
      event({ _id: '2', title: 'Second', slug: { _type: 'slug', current: 'second' }, date: '2026-08-02T16:00:00Z' }),
      event({ _id: '4', title: 'Fourth', slug: { _type: 'slug', current: 'fourth' }, date: '2026-08-04T16:00:00Z' }),
    ];

    expect(getUpcomingEvents(events, new Date('2026-07-15T16:00:00Z')).map(({ title }) => title))
      .toEqual(['First', 'Second', 'Third', 'Fourth']);
  });
});

describe('event display copy', () => {
  it('formats bilingual dates and recurrence labels', () => {
    expect(formatEventDate('2026-07-15', 'en')).toContain('July 15, 2026');
    expect(formatEventDate('2026-07-15', 'zh')).toContain('2026年7月15日');
    expect(getRecurrenceLabel(event({ recurrence: 'weekly', recurrenceEndDate: '2026-08-12' }), 'en'))
      .toBe('Weekly through August 12, 2026');
  });
});
