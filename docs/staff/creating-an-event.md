# Creating an Event

This guide walks you through adding a new event to the website via Sanity Studio.

## Steps

### 1. Open the Events Section

In the Studio sidebar, click **Event**. You'll see a list of existing events sorted by date (soonest first).

### 2. Create a New Event

Click the **+ Create** button (or the pencil/compose icon) at the top of the list.

### 3. Fill In the Fields

| Field | Required? | What to Enter |
|---|---|---|
| **Title** | ✅ Yes | The event name, e.g. "Easter Sunday Service" |
| **Start Date** | No | When the event starts — use the date and time picker |
| **End Date** | No | When the event ends — leave blank for single-day events |
| **Time Description** | No | A human-readable time string, e.g. "Sundays 10:00 AM" or "7:00 PM – 9:00 PM" |
| **Location** | No | Where the event takes place, e.g. "Main Sanctuary" or "Fellowship Hall" |
| **Description** | No | A rich text description — you can use bold, italics, and bullet lists |
| **Image** | No | Upload a photo or flyer for the event (supports hotspot cropping — see below) |
| **Recurring** | No | Toggle ON if this is a recurring event (defaults to OFF) |
| **Language** | ✅ Yes | Select `en` for English or `zh` for Chinese (defaults to `en`) |

### 4. Setting the Image Hotspot

When you upload an image, you can click **Edit** on the image to set a **hotspot** — this tells the website which part of the image is most important, so it crops correctly at different screen sizes.

1. Click the uploaded image to open the editor.
2. Drag the circle to the focal point of the image (e.g. center on a person's face).
3. Adjust the crop rectangle if needed.
4. Click **Done** or close the editor.

### 5. Using the Description Field

The Description field is a rich text editor. You can:

- **Bold** or *italicize* text using the toolbar buttons
- Create bullet or numbered lists
- The formatting will appear on the website as you see it in the editor

Keep descriptions concise — a short paragraph or a few bullet points works best.

### 6. Publish

Click the **Publish** button in the bottom-left corner of the editor.

### 7. Verify on the Live Site

Wait **2–3 minutes** for the site to rebuild, then visit the Events page on the live site to confirm your event appears correctly.

## Publishing in Both Languages

To make an event available in both English and Chinese, create **two separate event documents** — one with Language set to `en` and one with Language set to `zh`. Fill in the title, description, and other text fields in the appropriate language.

## Common Mistakes

| Mistake | What Happens | How to Fix |
|---|---|---|
| Forgetting to set the Language | Defaults to English — won't show on the Chinese site | Edit the event, change Language to `zh`, and re-publish |
| Confusing Start Date with Time Description | Start Date is a precise date/time for sorting; Time Description is the human-readable text shown on the site | Fill in both: Start Date for when it occurs, Time Description for how it displays |
| Not seeing changes on the live site | The site hasn't rebuilt yet | Wait 2–3 minutes and refresh the page |
| Uploading a very large image | Slower page loads | Resize images to under 2 MB before uploading |
