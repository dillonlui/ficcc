# Managing Grow Pages

Grow pages are the ministry-specific pages under `/en/grow/...` and `/zh/grow/...`.

## Page Documents

There are eight Grow page documents:

- English site: English Ministry, Chinese Ministry, Youth Ministry, Children's Ministry
- Chinese site: 英語事工, 華語事工, 青少年事工, 兒童事工

Edit the English and Chinese versions separately. They may describe the same ministry facts, but the public copy should be written for the audience reading that language site.

## Fields

- **Publicly Visible** — hides or shows this page on the public site after rebuild.
- **Audience** — identifies which route this document controls.
- **Language** — controls whether the document belongs to `/en` or `/zh`.
- **SEO Title / SEO Description** — browser and search metadata.
- **Hero Title / Hero Subtitle / Hero Image** — top page section.
- **Intro Text** — paragraph above the group cards.
- **Groups / Classes** — the cards for worship gatherings, fellowships, classes, or care options.
- **Fellowship Detail Page** — optional on each card. For the Chinese Ministry page, select a published **團契詳情** document to make that card open its CMS-managed detail page.
- **Sermons Callout** — optional text and link for the bottom sermon callout.

## Routes

| Document | Public Route |
|---|---|
| English Ministry (EN) | `/en/grow/english` |
| Chinese Ministry (EN) | `/en/grow/chinese` |
| Youth Ministry (EN) | `/en/grow/youth` |
| Children's Ministry (EN) | `/en/grow/children` |
| 英語事工 (ZH) | `/zh/grow/english` |
| 華語事工 (ZH) | `/zh/grow/chinese` |
| 青少年 (ZH) | `/zh/grow/youth` |
| 兒童 (ZH) | `/zh/grow/children` |

## Chinese Fellowship Detail Pages

The five starter cards on `/zh/grow/chinese` already open detail pages. Their initial text is a temporary fallback so the pages remain available while ministry content is being gathered.

To publish the real content:

1. In **Chinese → 團契詳情**, create a document in Chinese with a unique slug, meeting time, image, and description.
2. Publish it, then open **Chinese → 成長 / 事工 → 華語事工**.
3. On the matching group card, select that document in **Fellowship Detail Page** and publish the Grow page.

The detail page is generated on the next site rebuild. Add any new fellowship card and link its published document in the same way; no code change is needed.

## Images

If a Grow page image is left blank, the website uses the built-in fallback image for that page. Add image alt text when an image communicates meaningful information. Leave alt text blank only for decorative images.

## Publishing

After publishing, wait 2-3 minutes for the site to rebuild. Then check the exact route for the page you edited.
