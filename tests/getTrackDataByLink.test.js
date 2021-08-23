const getTrackDataByURL = require('../src/api/getTrackDataByURL');

const YT_MUSIC_SAMPLE_URL = 'https://music.youtube.com/watch?v=u7T2OR-O2Vk&feature=share';
const SPOTIFY_SAMPLE_URL = 'https://open.spotify.com/track/6QewNVIDKdSl8Y3ycuHIei?si=71381504387d48ab';
const INCORRECT_URL = 'https://google.com';

test('exception on incorrect url', async () => {
  await expect(getTrackDataByURL(INCORRECT_URL)).rejects.toThrow('UNRECOGNIZED_SERVICE');
});

test('recognizes link for YT', async () => {
  expect(await getTrackDataByURL(YT_MUSIC_SAMPLE_URL)).toHaveProperty(
    'service',
    'YT_MUSIC',
  );
});

test('recognizes link for Spotify', async () => {
  expect(await getTrackDataByURL(SPOTIFY_SAMPLE_URL)).toHaveProperty(
    'service',
    'SPOTIFY',
  );
});

test('result have needed data for YT link', async () => {
  const result = await getTrackDataByURL(YT_MUSIC_SAMPLE_URL);
  expect(result).toHaveProperty('services');
  expect(result).toHaveProperty('artists');
  expect(result).toHaveProperty('name');
  expect(result).toHaveProperty('ytUrl');
  expect(result).toHaveProperty('spotifyUrl');
  expect(result).toHaveProperty('thumbUrl');
});

test('result have needed data for Spotify link', async () => {
  const result = await getTrackDataByURL(SPOTIFY_SAMPLE_URL);
  expect(result).toHaveProperty('service');
  expect(result).toHaveProperty('artists');
  expect(result).toHaveProperty('name');
  expect(result).toHaveProperty('ytUrl');
  expect(result).toHaveProperty('spotifyUrl');
  expect(result).toHaveProperty('thumbUrl');
});
