/**
 * Fetch latest videos from a YouTube channel.
 *
 * The public channel feed supplies the information needed for the sermons page,
 * without requiring a YouTube Data API key.
 */

export interface YouTubeVideo {
  videoId: string;
  title: string;
  date: string; // ISO date string
  thumbnail: string;
}

const CHANNEL_ID = 'UCRuUdmxHG2c6OtuKcdH2rSw'; // @FICCCenglish
const YOUTUBE_TIMEOUT_MS = 8_000;

function decodeXml(value: string): string {
  return value
    .replace(/&#(x[\da-f]+|\d+);/gi, (_match, entity) => {
      const codePoint = entity.startsWith('x') || entity.startsWith('X')
        ? Number.parseInt(entity.slice(1), 16)
        : Number.parseInt(entity, 10);
      return Number.isNaN(codePoint) ? _match : String.fromCodePoint(codePoint);
    })
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function getXmlTagValue(entry: string, tag: string): string | undefined {
  const match = entry.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  return match?.[1] ? decodeXml(match[1].trim()) : undefined;
}

async function getLatestVideosFromFeed(count: number): Promise<YouTubeVideo[]> {
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
  const response = await fetch(feedUrl, { signal: AbortSignal.timeout(YOUTUBE_TIMEOUT_MS) });
  if (!response.ok) {
    console.error(`[youtube] Channel feed fetch failed: ${response.status}`);
    return [];
  }

  const feed = await response.text();
  const entries = feed.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];

  return entries.slice(0, count).flatMap((entry) => {
    const videoId = getXmlTagValue(entry, 'yt:videoId');
    const title = getXmlTagValue(entry, 'title');
    const published = getXmlTagValue(entry, 'published');
    if (!videoId || !title) return [];

    return [{
      videoId,
      title,
      date: published?.split('T')[0] ?? '',
      thumbnail: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
    }];
  });
}

/**
 * Fetches the latest `count` videos from the FICCC English YouTube channel.
 * Returns an empty array when the public feed is unavailable.
 */
export async function getLatestVideos(count = 6): Promise<YouTubeVideo[]> {
  return getLatestVideosFromFeed(count).catch(() => []);
}
