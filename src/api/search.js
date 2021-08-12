const { searchOnSpotify } = require('./spotifyHelpers');
const { getYTTrackURLByISRC } = require('./ytHelpers');

const search = async (query) => {
  const tracks = await searchOnSpotify(query);

  const ytUrls = await Promise.allSettled(
    tracks.map((track) => getYTTrackURLByISRC(track.external_ids.isrc)),
  );

  const result = [];

  tracks.forEach(async (track, index) => {
    let artists = '';

    if (track.artists.length > 1) {
      artists = track.artists.reduce(
        ({ name }, cur) => `${name} & ${cur.name}`,
      );
    } else {
      artists = track.artists[0].name;
    }

    const ytUrl = ytUrls[index];
    if (ytUrl.status === 'rejected') {
      return;
    }

    result.push({
      name: track.name,
      artists,
      ytUrl: ytUrl.value,
      spotifyUrl: track.external_urls.spotify,
      thumbUrl: track.album.images[1].url,
    });
  });

  return result;
};

module.exports = search;
