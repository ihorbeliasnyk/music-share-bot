const axios = require('axios').default;
const { URL } = require('url');

const { YT_API_KEY } = process.env;

const getYTTrackURLByISRC = async (isrc) => {
  const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search?');
  searchUrl.searchParams.append('part', 'snippet');
  searchUrl.searchParams.append('type', 'video');
  searchUrl.searchParams.append('key', YT_API_KEY);
  searchUrl.searchParams.append('regionCode', 'UA');
  searchUrl.searchParams.append('q', isrc);

  const { data } = await axios.get(searchUrl.href);
  const trackId = data.items[0].id.videoId;

  const trackUrl = new URL('https://music.youtube.com/watch');
  trackUrl.searchParams.append('v', trackId);

  return trackUrl.href;
};

const getYTTrackData = async (id) => {
  const trackDataURL = new URL('https://www.googleapis.com/youtube/v3/videos');
  trackDataURL.searchParams.append('id', id);
  trackDataURL.searchParams.append('part', 'snippet');
  trackDataURL.searchParams.append('key', YT_API_KEY);

  const { data } = await axios.get(trackDataURL.href);

  if (!data.items[0]) throw new Error('SONG_NOT_FOUND');

  const { snippet } = data.items[0];
  return snippet;
};

exports.getYTTrackData = getYTTrackData;
exports.getYTTrackURLByISRC = getYTTrackURLByISRC;
