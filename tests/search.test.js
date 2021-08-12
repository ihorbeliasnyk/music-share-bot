const search = require('../src/api/search');

test('search results have needed data', async () => {
  const result = await search('Pearl Jam');
  result.forEach((el) => {
    expect(el).toHaveProperty('artists');
    expect(el).toHaveProperty('name');
    expect(el).toHaveProperty('ytUrl');
    expect(el).toHaveProperty('spotifyUrl');
    expect(el).toHaveProperty('thumbUrl');
  });
});
