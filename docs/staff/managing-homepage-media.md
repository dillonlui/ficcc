# Managing Homepage Media

This guide explains how to update homepage images and hero media in Sanity Studio.

## Homepage Documents

The homepage has separate English and Chinese documents. They are not direct translations, so update each ministry's document intentionally:

- English homepage: Language `en`
- Chinese homepage: Language `zh`

## Hero Media

The homepage hero supports either an image or a video.

### Hero Media Type

Choose one:

- **Image** — Shows the Hero Image as the background.
- **Video** — Shows the Hero Video as the moving background and uses a fallback image as the poster/fallback.

### Hero Image / Video Poster Fallback

Always add this field. It is used:

- as the hero background when Hero Media Type is **Image**
- as the default poster/fallback image when Hero Media Type is **Video**

Use a clear, welcoming image where faces are not covered by the headline or service information.

### Video Failure Fallback Image

This field appears when Hero Media Type is **Video**.

Use it when the best still image for video fallback is different from the main Hero Image. If you leave it blank, the site reuses the Hero Image as the video poster/fallback.

### Hero Video

Only upload optimized web video. Good homepage video files are:

- MP4 or WebM
- silent or muted-friendly
- short and loopable
- preferably under 8 MB

Do not upload large camera-original files such as `.mov` exports directly into the hero video field.

## Pause Button

If the homepage uses video, the site automatically shows a small pause/play button in the bottom-right of the hero. This is required so visitors can pause motion that starts automatically.

## Section Images

Homepage sections have optional images and alt text.

Use the **Image Alt Text** field to describe meaningful images. Leave it blank only when the image is purely decorative.

Good alt text:

```text
Church members praying together at retreat
```

Avoid file names or vague text:

```text
IMG_1573
Nice photo
```

## Publishing

After publishing, wait 2-3 minutes for the site rebuild to finish. Then refresh the homepage to confirm the change.
