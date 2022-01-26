const { Markup } = require('telegraf');
const getTrackDataByURL = require('./api/getTrackDataByURL');

module.exports = async (ctx) => {
  const { query } = ctx.update.inline_query;

  const data = [];

  try {
    data[0] = await getTrackDataByURL(query);
  } catch (e) {
    await ctx.answerInlineQuery([]);
    throw new Error(e);
  }

  const results = data.map((el, i) => {
    const {
      name, artists, ytUrl, spotifyUrl, thumbUrl,
    } = el;

    const keyboard = Markup.inlineKeyboard([
      Markup.button.url('YT Music', ytUrl),
      Markup.button.url('Spotify', spotifyUrl),
    ]).reply_markup;

    return {
      type: 'article',
      id: i,
      title: name,
      description: artists,
      reply_markup: keyboard,
      input_message_content: { message_text: `📻  ${name} - ${artists}` },
      thumb_url: thumbUrl,
      thumb_width: '300',
      thumb_height: '300',
    };
  });

  return ctx.answerInlineQuery(results);
};
