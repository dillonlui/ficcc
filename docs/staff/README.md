# Staff Content Management Guide

This guide explains how to manage church website content using Sanity Studio — no coding required.

## Accessing Sanity Studio

Open your browser and go to:

```
https://your-site.com/admin
```

Log in with your Sanity account credentials. If you don't have an account, ask the site administrator to invite you.

## How Content Is Organized

### Documents vs. Singletons

There are two kinds of content in the Studio:

- **Documents** (Sermons, Events) — You can create as many as you need. Each sermon or event is its own document.
- **Page documents** (Homepage, About, Grow pages, Contact, etc.) — Each public route has a fixed document in the Studio.
- **Singletons** (Site Settings) — There is one per language. Site Settings controls global things like the church name, contact info, service times, and the announcement bar.

### Language Variants

The website supports English (EN) and Chinese (ZH). Most content types have a **Language** field:

- **Sermons and Events**: Each document belongs to one language. To publish a sermon in both English and Chinese, create two separate documents — one with Language set to `en` and one set to `zh`.
- **Page Documents**: English pages live under `/en/...`; Chinese pages live under `/zh/...`. Edit the EN and ZH page documents separately because they are not direct translations.
- **Grow Pages**: English Ministry, Chinese Ministry, Youth, and Children each have EN and ZH page documents. This keeps the Studio organized by language first, then ministry audience.
- **Site Settings**: There are two Site Settings documents — one for EN and one for ZH. Make sure to update **both** when changing something that applies to the whole site, like service times or the announcement bar.

### Public Visibility

Most page documents and public collection items include a **Publicly Visible** switch.

- ON means the page or item appears on the public website after the next rebuild.
- OFF means the public page redirects away or the item is removed from public lists after the next rebuild.
- Turning visibility OFF does not delete the content from Sanity.

## The Publish → Rebuild → Live Pipeline

**Changes are not instant.** Here's what happens when you publish content:

1. You click **Publish** in Sanity Studio.
2. Sanity notifies the hosting platform (Vercel) that content has changed.
3. Vercel rebuilds the entire website with the new content.
4. The updated site goes live.

**This takes approximately 2–3 minutes.** Don't panic if you don't see your changes right away — just wait a few minutes and refresh the page.

> **Tip:** If changes still don't appear after 5 minutes, try clearing your browser cache or opening the page in a private/incognito window.

## Workflow Guides

- [Publishing a Sermon](./publishing-a-sermon.md)
- [Creating an Event](./creating-an-event.md)
- [Managing the Announcement Bar](./managing-announcement-bar.md)
- [Managing Homepage Media](./managing-homepage-media.md)
- [Managing Grow Pages](./managing-grow-pages.md)
- [Managing Public Visibility](./managing-public-visibility.md)
- [Sanity Setup Checklist](./sanity-setup.md)
