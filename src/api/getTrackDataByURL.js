const { URL } = require('url');

const { getSpotifyTrackData, searchOnSpotify } = require('./spotifyHelpers');
const { getYTTrackData, getYTTrackURLByISRC } = require('./ytHelpers');

const hosts = {
  'music.youtube.com': 'YT_MUSIC',
  'open.spotify.com': 'SPOTIFY',
};

const getTrackDataByURL = async (trackURL) => {
  const parsedURL = new URL(trackURL);
  const service = hosts[parsedURL.hostname];
  if (!service) throw new Error('UNRECOGNIZED_SERVICE');

  const result = { service };

  if (service === 'YT_MUSIC') {
    const trackId = parsedURL.searchParams.get('v');
    const data = await getYTTrackData(trackId);
    const name = data.title;
    const [artists] = data.tags;

    // Spotify can't find track when query have multiple artists connected with ampersand
    const artistsWithoutAmpersand = artists.replace(/ &/g, '');
    const [spotifyData] = await searchOnSpotify(`${name} ${artistsWithoutAmpersand}`);

    result.name = name;
    result.artists = artists;
    result.ytUrl = trackURL;
    result.spotifyUrl = spotifyData.external_urls.spotify;
    result.thumbUrl = spotifyData.album.images[1].url;
  } else if (service === 'SPOTIFY') {
    const trackId = parsedURL.pathname.split('/')[2];
    const data = await getSpotifyTrackData(trackId);
    const ytUrl = await getYTTrackURLByISRC(data.external_ids.isrc);

    let artists = '';

    if (data.artists.length > 1) {
      artists = data.artists.reduce(({ name }, cur) => `${name} & ${cur.name}`);
    } else {
      artists = data.artists[0].name;
    }

    result.name = data.name;
    result.artists = artists;
    result.ytUrl = ytUrl;
    result.spotifyUrl = trackURL;
    result.thumbUrl = data.album.images[1].url;
  }

  return result;
};

module.exports = getTrackDataByURL;
