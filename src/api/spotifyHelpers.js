const axios = require('axios').default;
const { URL, URLSearchParams } = require('url');

const { SPOTIFY_USERNAME, SPOTIFY_PASSWORD } = process.env;

const getSpotifyToken = async () => {
  const url = 'https://accounts.spotify.com/api/token';
  const { data } = await axios({
    method: 'POST',
    url,
    data: new URLSearchParams({ grant_type: 'client_credentials' }).toString(),
    auth: {
      username: SPOTIFY_USERNAME,
      password: SPOTIFY_PASSWORD,
    },
  });

  return data.access_token;
};

const searchOnSpotify = async (query) => {
  const url = new URL('https://api.spotify.com/v1/search');
  url.searchParams.append('q', query);
  url.searchParams.append('type', 'track');
  url.searchParams.append('limit', 5);

  const accessToken = await getSpotifyToken();

  const { data } = await axios({
    method: 'GET',
    url: url.href,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return data.tracks.items;
};

const getSpotifyTrackData = async (id) => {
  const url = `https://api.spotify.com/v1/tracks/${id}`;
  const accessToken = await getSpotifyToken();

  const { data } = await axios({
    method: 'GET',
    url,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return data;
};

exports.getSpotifyToken = getSpotifyToken;
exports.searchOnSpotify = searchOnSpotify;
exports.getSpotifyTrackData = getSpotifyTrackData;
