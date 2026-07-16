import type { Event } from './sanity';

export const EVENT_TIME_ZONE = 'America/New_York';

export interface ActiveEvent extends Event {
  nextOccurrenceDate: string;
  isRecurring: boolean;
  isOngoing: boolean;
}

type DateParts = { year: number; month: number; day: number };

function dateParts(value: string): DateParts | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
}

function keyFromParts({ year, month, day }: DateParts): string {
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function dateKey(value: string | Date, timeZone = EVENT_TIME_ZONE): string | null {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);

  return keyFromParts({ year: get('year'), month: get('month'), day: get('day') });
}

export function getEventCalendarDate(
  value: string | Date | undefined,
  timeZone = EVENT_TIME_ZONE,
): string | null {
  return value ? dateKey(value, timeZone) : null;
}

function ordinal(key: string): number {
  const parts = dateParts(key);
  return parts ? Math.floor(Date.UTC(parts.year, parts.month - 1, parts.day) / 86_400_000) : NaN;
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function addDays(key: string, amount: number): string {
  const parts = dateParts(key)!;
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + amount));
  return keyFromParts({
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  });
}

function addMonthsFromAnchor(anchor: DateParts, amount: number): string {
  const monthIndex = anchor.year * 12 + anchor.month - 1 + amount;
  const year = Math.floor(monthIndex / 12);
  const month = (monthIndex % 12) + 1;
  return keyFromParts({
    year,
    month,
    day: Math.min(anchor.day, daysInMonth(year, month)),
  });
}

function addYearsFromAnchor(anchor: DateParts, amount: number): string {
  const year = anchor.year + amount;
  return keyFromParts({
    year,
    month: anchor.month,
    day: Math.min(anchor.day, daysInMonth(year, anchor.month)),
  });
}

function nextRecurringDate(
  startKey: string,
  todayKey: string,
  frequency: Exclude<Event['recurrence'], 'none' | undefined>,
): string {
  if (startKey >= todayKey) return startKey;

  if (frequency === 'weekly') {
    const elapsedDays = ordinal(todayKey) - ordinal(startKey);
    return addDays(startKey, Math.ceil(elapsedDays / 7) * 7);
  }

  const start = dateParts(startKey)!;
  const today = dateParts(todayKey)!;

  if (frequency === 'monthly') {
    let elapsedMonths = (today.year - start.year) * 12 + today.month - start.month;
    let candidate = addMonthsFromAnchor(start, Math.max(0, elapsedMonths));
    if (candidate < todayKey) candidate = addMonthsFromAnchor(start, ++elapsedMonths);
    return candidate;
  }

  let elapsedYears = today.year - start.year;
  let candidate = addYearsFromAnchor(start, Math.max(0, elapsedYears));
  if (candidate < todayKey) candidate = addYearsFromAnchor(start, ++elapsedYears);
  return candidate;
}

/**
 * Resolve an event's next public occurrence using church-local calendar dates.
 * Events remain active through the end of their final calendar day.
 */
export function getEventOccurrence(
  event: Event,
  now = new Date(),
  timeZone = EVENT_TIME_ZONE,
): ActiveEvent | null {
  if (event.isVisible === false || !event.date || !event.slug?.current) return null;

  const todayKey = dateKey(now, timeZone);
  const startKey = dateKey(event.date, timeZone);
  if (!todayKey || !startKey) return null;

  const recurrence = event.recurrence ?? 'none';
  const isRecurring = recurrence !== 'none' && Boolean(event.recurrenceEndDate);

  if (isRecurring) {
    const recurrenceEndKey = dateKey(event.recurrenceEndDate!, timeZone);
    if (!recurrenceEndKey || recurrenceEndKey < todayKey) return null;

    const nextOccurrenceDate = nextRecurringDate(
      startKey,
      todayKey,
      recurrence as Exclude<Event['recurrence'], 'none' | undefined>,
    );
    if (nextOccurrenceDate > recurrenceEndKey) return null;

    return {
      ...event,
      nextOccurrenceDate,
      isRecurring: true,
      isOngoing: nextOccurrenceDate === todayKey,
    };
  }

  const finalKey = dateKey(event.endDate || event.date, timeZone);
  if (!finalKey || finalKey < todayKey) return null;

  return {
    ...event,
    nextOccurrenceDate: startKey,
    isRecurring: false,
    isOngoing: startKey <= todayKey && finalKey >= todayKey,
  };
}

/** Return every active event, ordered by its next occurrence. */
export function getUpcomingEvents(
  events: Event[],
  now = new Date(),
  timeZone = EVENT_TIME_ZONE,
): ActiveEvent[] {
  return events
    .map((event) => getEventOccurrence(event, now, timeZone))
    .filter((event): event is ActiveEvent => Boolean(event))
    .sort((a, b) =>
      a.nextOccurrenceDate.localeCompare(b.nextOccurrenceDate) || a.title.localeCompare(b.title),
    );
}

export function isEventEnded(
  event: Event,
  now = new Date(),
  timeZone = EVENT_TIME_ZONE,
): boolean {
  return getEventOccurrence(event, now, timeZone) === null;
}

export function formatEventDate(
  key: string,
  language: 'en' | 'zh',
  options: Intl.DateTimeFormatOptions = {},
): string {
  const parts = dateParts(key);
  if (!parts) return key;

  return new Intl.DateTimeFormat(language === 'zh' ? 'zh-TW' : 'en-US', {
    timeZone: 'UTC',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(new Date(Date.UTC(parts.year, parts.month - 1, parts.day, 12)));
}

export function getRecurrenceLabel(event: Event, language: 'en' | 'zh'): string | null {
  if (!event.recurrence || event.recurrence === 'none' || !event.recurrenceEndDate) return null;

  const labels = language === 'zh'
    ? { weekly: '每週', monthly: '每月', yearly: '每年' }
    : { weekly: 'Weekly', monthly: 'Monthly', yearly: 'Yearly' };
  const endDate = formatEventDate(event.recurrenceEndDate, language, {
    weekday: undefined,
  });

  return language === 'zh'
    ? `${labels[event.recurrence]}，至 ${endDate}`
    : `${labels[event.recurrence]} through ${endDate}`;
}
