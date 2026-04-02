# Managing the Announcement Bar

The announcement bar is a banner that appears at the top of every page on the website. Use it for timely announcements like service changes, special events, or urgent notices.

## Enabling the Announcement Bar

### 1. Open Site Settings

In the Studio sidebar, click **Site Settings**. You'll see two entries — one for English (EN) and one for Chinese (ZH).

**Select the language variant you want to update.** If the announcement should appear on both the English and Chinese sites, you need to update both.

### 2. Find the Announcement Bar Fields

Scroll down in the Site Settings editor until you see the announcement bar fields:

- **Announcement Bar Enabled** — toggle switch
- **Announcement Bar Text** — the message to display
- **Announcement Bar Link** — optional URL (makes the bar clickable)

> **Note:** The text and link fields only appear when Announcement Bar Enabled is toggled ON.

### 3. Configure the Bar

1. Set **Announcement Bar Enabled** to **ON** (toggle it so it's checked/active).
2. Enter the **Announcement Bar Text** — keep it short and clear, e.g. "Christmas Eve Service — Dec 24 at 7 PM".
3. Optionally enter an **Announcement Bar Link** — a full URL like `https://your-site.com/events` or a relative path like `/events`. The entire bar becomes clickable when a link is set.

### 4. Publish

Click the **Publish** button in the bottom-left corner.

### 5. Verify on the Live Site

Wait **2–3 minutes** for the site to rebuild, then visit the website to confirm the announcement bar appears at the top of the page.

## Updating the Announcement

To change the text or link:

1. Open the same Site Settings document.
2. Edit the **Announcement Bar Text** or **Announcement Bar Link** fields.
3. Click **Publish**.
4. Wait 2–3 minutes for the rebuild.

## Disabling the Announcement Bar

1. Open the Site Settings document.
2. Set **Announcement Bar Enabled** to **OFF** (toggle it so it's unchecked).
3. Click **Publish**.
4. Wait 2–3 minutes — the bar will disappear from the site.

You don't need to clear the text or link fields. They are hidden when the bar is disabled and will be preserved for next time.

## Updating Both Language Variants

The English and Chinese sites have **separate** Site Settings documents. If your announcement applies to both audiences:

1. Update the **English (EN)** Site Settings with the English announcement text.
2. Update the **Chinese (ZH)** Site Settings with the Chinese announcement text.
3. Publish **both** documents.

If you only update one language variant, the other site will not show the announcement (or will show the old one).

## Common Mistakes

| Mistake | What Happens | How to Fix |
|---|---|---|
| Only updating one language variant | The announcement only appears on one version of the site | Update and publish both EN and ZH Site Settings |
| Leaving Enabled ON with empty text | The bar may appear empty or as a thin colored strip | Either enter text or disable the bar |
| Entering an invalid link | The bar won't link anywhere or may show an error | Use a full URL (starting with `http://` or `https://`) or a relative path (starting with `/`) |
| Not seeing changes on the live site | The site hasn't rebuilt yet | Wait 2–3 minutes and refresh the page |
