/**
 * Fetch latest videos from a YouTube channel.
 *
 * The public channel feed keeps the sermons page working without a YouTube Data
 * API key. When a key is configured, use the Data API first because it provides
 * the same information in a more structured response.
 */

export interface YouTubeVideo {
  videoId: string;
  title: string;
  date: string; // ISO date string
  thumbnail: string;
}

const CHANNEL_ID = 'UCRuUdmxHG2c6OtuKcdH2rSw'; // @FICCCenglish
// Uploads playlist ID is derived from channel ID (UC → UU prefix). This never
// changes, so hardcoding it eliminates one API call per request and halves latency.
const UPLOADS_PLAYLIST_ID = 'UURuUdmxHG2c6OtuKcdH2rSw';
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
 * Returns an empty array only when both the Data API and public feed are
 * unavailable.
 */
export async function getLatestVideos(count = 6): Promise<YouTubeVideo[]> {
  const apiKey = import.meta.env.YOUTUBE_API_KEY;
  if (!apiKey) return getLatestVideosFromFeed(count);

  try {
    // Fetch latest videos from the uploads playlist (single API call)
    const playlistUrl = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
    playlistUrl.searchParams.set('part', 'snippet');
    playlistUrl.searchParams.set('playlistId', UPLOADS_PLAYLIST_ID);
    playlistUrl.searchParams.set('maxResults', String(count));
    playlistUrl.searchParams.set('key', apiKey);

    const playlistRes = await fetch(playlistUrl.toString(), {
      signal: AbortSignal.timeout(YOUTUBE_TIMEOUT_MS),
    });
    if (!playlistRes.ok) {
      console.error(`[youtube] Playlist fetch failed: ${playlistRes.status}`);
      return getLatestVideosFromFeed(count);
    }

    const playlistData = await playlistRes.json();

    const videos = (playlistData.items ?? []).map((item: any) => ({
      videoId: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      date: item.snippet.publishedAt?.split('T')[0] ?? '',
      thumbnail: item.snippet.thumbnails?.medium?.url ??
        `https://img.youtube.com/vi/${item.snippet.resourceId.videoId}/mqdefault.jpg`,
    }));
    return videos.length > 0 ? videos : getLatestVideosFromFeed(count);
  } catch (err) {
    console.error('[youtube] Fetch error:', err);
    return getLatestVideosFromFeed(count).catch(() => []);
  }
}
