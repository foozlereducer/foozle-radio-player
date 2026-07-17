import NodeCache from 'node-cache';
import { fetchSpotifyTrackMetadata } from './spotifyTrackSearch.js';

const enrichedMetadataCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

export function extractMetadata(streamTitle) {
  if (!streamTitle || typeof streamTitle !== 'string') {
    return { currentTrack: 'Unknown', artist: 'Unknown Artist' };
  }

  const [artist, ...trackParts] = streamTitle.split(' - ').map((part) => part.trim());
  return {
    currentTrack: trackParts.join(' - ') || artist || 'Unknown',
    artist: trackParts.length ? artist || 'Unknown Artist' : 'Unknown Artist',
  };
}

export async function enrichMetadata(metadata) {
  const { currentTrack, artist } = metadata;
  if (!currentTrack || !artist || currentTrack === 'Unknown' || artist === 'Unknown Artist') {
    return metadata;
  }

  const cacheKey = `${artist}-${currentTrack}`.toLowerCase();
  const cached = enrichedMetadataCache.get(cacheKey);
  if (cached) return { ...metadata, ...cached };

  const spotifyData = await fetchSpotifyTrackMetadata(currentTrack, artist);
  const enrichment = spotifyData || { duration: 240 };
  enrichedMetadataCache.set(cacheKey, enrichment);
  return { ...metadata, ...enrichment };
}
