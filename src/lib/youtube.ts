/**
 * Fetch latest videos from a YouTube channel via the Data API v3.
 * Used on the sermons page (SSR) so data is always fresh.
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

/**
 * Fetches the latest `count` videos from the FICCC English YouTube channel.
 * Returns an empty array if the API key is missing or the request fails.
 */
export async function getLatestVideos(count = 6): Promise<YouTubeVideo[]> {
  const apiKey = import.meta.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.warn('[youtube] YOUTUBE_API_KEY not set — skipping YouTube fetch');
    return [];
  }

  try {
    // Fetch latest videos from the uploads playlist (single API call)
    const playlistUrl = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
    playlistUrl.searchParams.set('part', 'snippet');
    playlistUrl.searchParams.set('playlistId', UPLOADS_PLAYLIST_ID);
    playlistUrl.searchParams.set('maxResults', String(count));
    playlistUrl.searchParams.set('key', apiKey);

    const playlistRes = await fetch(playlistUrl.toString());
    if (!playlistRes.ok) {
      console.error(`[youtube] Playlist fetch failed: ${playlistRes.status}`);
      return [];
    }

    const playlistData = await playlistRes.json();

    return (playlistData.items ?? []).map((item: any) => ({
      videoId: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      date: item.snippet.publishedAt?.split('T')[0] ?? '',
      thumbnail: item.snippet.thumbnails?.medium?.url ??
        `https://img.youtube.com/vi/${item.snippet.resourceId.videoId}/mqdefault.jpg`,
    }));
  } catch (err) {
    console.error('[youtube] Fetch error:', err);
    return [];
  }
}
