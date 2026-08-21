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
- **Groups / Classes** — the cards for worship gatherings, fellowships, classes, or care options. Keep **Card Summary** concise; put schedules, contact details, meeting links, and longer content in the referenced detail page.
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

Cards on `/zh/grow/chinese` open a detail page only when staff explicitly select a published **團契詳情** document. A card without that reference remains an ordinary, unlinked card. This prevents a card from silently inheriting an unrelated fallback page.

To publish the real content:

1. In **Chinese → 團契詳情**, create a document in Chinese with a unique slug, meeting time, image, and description.
2. Publish it, then open **Chinese → 成長 / 事工 → 華語事工**.
3. On the matching group card, select that document in **Fellowship Detail Page** and publish the Grow page.

Use one unique detail document per card. Studio blocks publishing when two cards reference the same detail document. After publishing, click every linked card and confirm the heading on the destination matches the card that was clicked.

### One-time setup for the current six cards

Site administrators can review the proposed one-to-one setup without making changes:

```bash
npm run sanity:link:fellowships
```

After reviewing the six printed mappings, an administrator with a temporary local write token can apply it with `--apply`. For each currently unlinked card, the migration first copies the complete current description—including any email and Zoom information—into its new detail document. It then installs a shorter verbatim excerpt from that same staff-authored description as the interim card summary and attaches the missing reference. It never replaces an existing detail document or staff-selected reference. Staff can edit the interim summaries normally afterward.

The public route reads the published detail document. Add any new fellowship card and link its published document in the same way; no code change is needed.

## Images

If a Grow page image is left blank, the website uses the built-in fallback image for that page. Add image alt text when an image communicates meaningful information. Leave alt text blank only for decorative images.

## Publishing

Published content is normally visible immediately because the public route is server-rendered. Check the exact route in a private window. The publishing webhook may also start a 2–3 minute Vercel deployment, but that deployment does not write content back to Sanity.

## Deployment Safety

Normal website builds and deployments only read published Sanity content; they do not write to Sanity and cannot replace staff edits. The `sanity:seed*` and migration commands are manual maintenance tools and must never be added to the Vercel build command or CI workflows. The main bootstrap uses `createIfNotExists` and `setIfMissing`, but it should still be run only intentionally by a site administrator.
