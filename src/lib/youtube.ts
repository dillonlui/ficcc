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
    // Step 1: Get the uploads playlist ID from the channel
    const channelUrl = new URL('https://www.googleapis.com/youtube/v3/channels');
    channelUrl.searchParams.set('part', 'contentDetails');
    channelUrl.searchParams.set('id', CHANNEL_ID);
    channelUrl.searchParams.set('key', apiKey);

    const channelRes = await fetch(channelUrl.toString());
    if (!channelRes.ok) {
      console.error(`[youtube] Channel fetch failed: ${channelRes.status}`);
      return [];
    }

    const channelData = await channelRes.json();
    const uploadsPlaylistId =
      channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsPlaylistId) {
      console.error('[youtube] Could not find uploads playlist');
      return [];
    }

    // Step 2: Get latest videos from the uploads playlist
    const playlistUrl = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
    playlistUrl.searchParams.set('part', 'snippet');
    playlistUrl.searchParams.set('playlistId', uploadsPlaylistId);
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
