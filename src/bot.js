const { Telegraf } = require('telegraf');
const queryHandler = require('./queryHandler');

if (
  !process.env.BOT_TOKEN
  || !process.env.YT_API_KEY
  || !process.env.SPOTIFY_USERNAME
  || !process.env.SPOTIFY_PASSWORD
) {
  throw new Error('MISSING CREDENTIALS');
}

const { BOT_TOKEN } = process.env;

const bot = new Telegraf(BOT_TOKEN);

bot.start(async (ctx) => {
  ctx.reply('Hi. You can use me in any chat with @MusVertBot (like @gif or @pic)');
});

bot.on('message', (ctx) => ctx.reply("I'm inline bot, use me in chats with @MusVertBot"));

bot.on('inline_query', queryHandler);

if (process.env.NODE_ENV === 'production') {
  if (!process.env.HOST) {
    throw new Error('MISSING HOST');
  }
  bot.telegram.setWebhook(`${process.env.HOST}${process.env.BOT_TOKEN}`);
  bot.startWebhook(process.env.BOT_TOKEN, undefined, process.env.PORT);
} else {
  bot.launch();
}

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
