import axios from 'axios';
import dotenv from 'dotenv'
dotenv.config();


let spotifyAccessToken = null;
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID?.trim();
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET?.trim();


/**
 * Fetch Spotify access token using Client Credentials flow.
 */
export const fetchSpotifyAccessToken = async () => {

  if (spotifyAccessToken) {
    return spotifyAccessToken; // Use cached token
  }

  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
      grant_type: 'client_credentials',
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
      },
     
    });

    spotifyAccessToken = response.data.access_token;
    setTimeout(() => {
      spotifyAccessToken = null; // Invalidate token after expiry
    }, response.data.expires_in * 1000);

    return spotifyAccessToken;
  } catch (error) {
    console.error('Failed to fetch Spotify access token:', error.message);
    return null;
  }
};
