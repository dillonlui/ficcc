# Creating an Event

Events appear automatically on the matching English or Chinese homepage while they are active. Each event also receives its own shareable landing page. There is no separate events directory to maintain.

## Create the Event

1. Open `/admin` and choose **English → Events** or **Chinese → 活動**.
2. Select **Create**.
3. Leave **Publicly Visible** on when the event is ready for the public website.
4. Complete the required fields and any optional details that will help visitors.
5. Select **Publish**.

## Required Fields

| Field | What to enter |
|---|---|
| **Title** | The public event name. |
| **Page URL** | Select **Generate** to create the landing-page address from the title. |
| **Start Date** | The first or only occurrence. The website uses this to order and expire the event. |
| **Repeats** | Choose **Does not repeat**, **Weekly**, **Monthly**, or **Yearly**. |
| **Language** | `en` for the English site or `zh` for the Chinese site. |

The website will not place an event on the homepage until it has both a Start Date and Page URL.

## Helpful Optional Fields

| Field | How it appears |
|---|---|
| **Short Summary** | Homepage card and event-page introduction. Keep it to one or two sentences. |
| **End Date** | Keeps a multi-day event active through its final day. |
| **Time Description** | A visitor-friendly time such as “6:00–8:00 PM”. |
| **Location Name** | Building, room, campus, or venue name. |
| **Address** | Street address displayed below the location. |
| **Map Link** | Adds a **View map** link. Use an `https://` map URL. |
| **Description** | Main event-page content. Paragraphs, headings, links, and lists are supported. |
| **Hero Image** | Homepage card and event-page hero image. Use a landscape image and set its hotspot. |
| **Image Alt Text** | Describes meaningful image content for visitors using screen readers. |
| **Action Button** | Optional registration or external information button. Both its label and link are needed. |
| **Contact Name / Email** | Optional event contact shown in the information panel. |
| **Other-Language Version** | Connects a separately authored English or Chinese version for the language switch. |

The event page adapts when optional fields are empty. Do not add placeholder copy merely to fill every field.

## Repeating Events

Repeating events require a **Final Occurrence Date**. This prevents an abandoned event from remaining on the homepage forever.

- **Weekly** repeats on the weekday of the Start Date.
- **Monthly** repeats on the same calendar day. For dates such as the 31st, shorter months use their final day.
- **Yearly** repeats on the same month and day.

Use repeating events for a time-limited series. Regular worship schedules and permanent ministries belong in the Visit or Grow content instead.

## What Happens Automatically

- The homepage section is completely hidden when there are no active events.
- One event receives a large feature layout.
- Two or three events appear in a grid.
- Four or more events appear in a carousel; every active event remains reachable.
- Events are ordered by their next occurrence.
- A one-time event leaves the homepage after its End Date, or after its Start Date when no End Date is supplied.
- A repeating event leaves the homepage after its Final Occurrence Date.
- An expired landing page remains available to old email and social links, but displays **This event has ended** and is removed from search indexing.

Dates are evaluated in the church’s New York timezone and remain active through the end of the displayed calendar day.

## Publishing in Both Languages

English and Chinese event content are separate documents. Create one event in each language when both ministries need it, then connect them using **Other-Language Version**. An event that exists only in Chinese appears only on the Chinese homepage, and vice versa.

## Verify the Result

After publishing, use Sanity’s event-page preview or open the appropriate homepage and event route. Published content is normally visible within moments; the webhook may also start a Vercel deployment, but the SSR route does not normally need to wait for it.

If an event does not appear, confirm that:

- **Publicly Visible** is on;
- Page URL and Start Date are present;
- the event has not expired;
- a repeating event has a valid Final Occurrence Date; and
- its Language matches the homepage you are viewing.
