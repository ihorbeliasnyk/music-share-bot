const { Telegraf, Markup } = require('telegraf');
const getTrackDataByURL = require('./api/getTrackDataByURL');

const { BOT_TOKEN } = process.env;

const bot = new Telegraf(BOT_TOKEN);
bot.use(Telegraf.log());

bot.start(async (ctx) => {
  ctx.reply('Hi. You can use me in any chat with @MusVertBot (like @gif bot)');
});

bot.on('message', (ctx) => ctx.reply("I'm inline bot, use me in chats with @MusVertBot"));

bot.on('inline_query', async (ctx) => {
  const { query } = ctx.update.inline_query;

  const data = [];

  try {
    data[0] = await getTrackDataByURL(query);
  } catch (e) {
    console.error(e);
    return ctx.answerInlineQuery([]);
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
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
