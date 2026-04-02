# Publishing a Sermon

This guide walks you through adding a new sermon to the website via Sanity Studio.

## Steps

### 1. Open the Sermons Section

In the Studio sidebar, click **Sermon**. You'll see a list of existing sermons sorted by date (newest first).

### 2. Create a New Sermon

Click the **+ Create** button (or the pencil/compose icon) at the top of the list.

### 3. Fill In the Fields

| Field | Required? | What to Enter |
|---|---|---|
| **Title** | ✅ Yes | The sermon title, e.g. "Walking by Faith" |
| **Slug** | ✅ Yes | Click **Generate** — it creates a URL-friendly version of the title automatically |
| **Speaker** | No | The speaker's name, e.g. "Pastor Zhang" |
| **Date** | No | The date the sermon was preached (use the date picker) |
| **Series** | No | The sermon series name, e.g. "Book of Romans" |
| **Scripture Reference** | No | The Bible passage, e.g. "Romans 8:1-11" |
| **YouTube Video ID** | No | The video ID only — see below for how to find it |
| **Language** | ✅ Yes | Select `en` for English or `zh` for Chinese (defaults to `en`) |

### 4. Finding the YouTube Video ID

The YouTube Video ID is the short code at the end of a YouTube URL — **not** the full link.

| If the URL looks like… | The Video ID is… |
|---|---|
| `https://www.youtube.com/watch?v=dQw4w9WgXcQ` | `dQw4w9WgXcQ` |
| `https://youtu.be/dQw4w9WgXcQ` | `dQw4w9WgXcQ` |

Paste **only** the ID (e.g. `dQw4w9WgXcQ`), not the full URL.

### 5. Publish

Click the **Publish** button in the bottom-left corner of the editor.

### 6. Verify on the Live Site

Wait **2–3 minutes** for the site to rebuild, then visit the Sermons page on the live site to confirm your sermon appears.

## Publishing in Both Languages

To make a sermon available in both English and Chinese, create **two separate sermon documents** — one with Language set to `en` and one with Language set to `zh`. Each should have its own title and fields filled in the appropriate language.

## Common Mistakes

| Mistake | What Happens | How to Fix |
|---|---|---|
| Forgetting to generate the Slug | The sermon won't have a URL and may not appear on the site | Edit the sermon, click **Generate** next to the Slug field, and re-publish |
| Pasting the full YouTube URL instead of just the ID | The video embed won't work | Remove everything except the ID portion (the part after `v=`) |
| Forgetting to set the Language | Defaults to English — won't show on the Chinese site | Edit the sermon, change Language to `zh`, and re-publish |
| Not seeing changes on the live site | The site hasn't rebuilt yet | Wait 2–3 minutes and refresh the page |
