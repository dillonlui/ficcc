# Media Inventory

Snapshot from the current local `media/` drop, created while preparing the launch media workflow.

## Current Totals

| Location | Contents | Size |
|---|---:|---:|
| `media/` | 260 JPGs + 1 MOV | 693 MB |
| `public/videos/ficcc-hero.mp4` | Optimized homepage hero video | 6.4 MB |
| `public/images/hero/ficcc-hero-poster.jpg` | Hero video poster/fallback | 199 KB |

## Raw Source Folders

| Folder | Files | Notes |
|---|---:|---|
| `media/BBQ2025-08-30/` | 138 | Raw JPG event photos |
| `media/Epp Fairewell/` | 122 | Raw JPG farewell photos |
| `media/FICCC.mov` | 1 | Raw 26-second QuickTime video |

The raw media folder should be treated as source material, not as web-ready public assets. Do not reference `media/` paths from pages or CMS content. Move only approved, optimized derivatives into `public/`, or upload images to Sanity so the Sanity CDN can generate web-sized formats.

## Hero Video Derivative

| Asset | Dimensions | Duration | Bitrate | Notes |
|---|---:|---:|---:|---|
| `media/FICCC.mov` | 3840x2024 | 26.0s | 19.3 Mbps | Original HEVC source, 60 MB |
| `public/videos/ficcc-hero.mp4` | 1600x844 | 26.0s | 2.1 Mbps | Silent H.264 web derivative, 6.4 MB |
| `public/images/hero/ficcc-hero-poster.jpg` | 1600x844 | n/a | n/a | Poster frame/fallback, 199 KB |

Command used for the current MP4 derivative:

```bash
ffmpeg -y -i media/FICCC.mov -vf "scale=1600:-2,fps=24" -an -c:v libx264 -preset slow -crf 31 -pix_fmt yuv420p -movflags +faststart public/videos/ficcc-hero.mp4
```

Command used for the poster:

```bash
ffmpeg -y -ss 00:00:03 -i media/FICCC.mov -frames:v 1 -vf "scale=1600:-2" -q:v 4 -update 1 public/images/hero/ficcc-hero-poster.jpg
```

## Launch Guidance

- Keep hero background video under roughly 8 MB unless there is a strong reason to go larger.
- Keep homepage poster/fallback images around 1600px wide and under 300 KB when possible.
- Use Sanity image fields for ordinary page images; the site requests Sanity images through the CDN at web-friendly widths and WebP format.
- Use optimized local `public/videos/` assets or Sanity file assets for video. Never upload the 60 MB MOV as the homepage hero.
- Final image selection still needs human review because it affects public representation of the church and may include people-sensitive moments.
