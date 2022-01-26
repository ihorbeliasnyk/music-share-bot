const { Telegraf } = require('telegraf');
const Sentry = require('@sentry/node');
// eslint-disable-next-line no-unused-vars
const Tracing = require('@sentry/tracing');
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

Sentry.init({
  dsn: 'https://d29f9a7cfd0b4c04bdc421c092dabae0@o1127561.ingest.sentry.io/6169806',
  tracesSampleRate: 1.0,
  maxBreadcrumbs: 3,
});

bot.start(async (ctx) => {
  const transaction = Sentry.startTransaction({
    op: 'directMessage',
    name: 'Direct message',
  });
  const { id, username } = ctx.update.message.from;
  Sentry.setUser({ id, username });

  await ctx.reply('Hi. You can use me in any chat simply by entering my username @MusVertBot and pasting a link to the track from Spotify or YouTube Music');

  transaction.setStatus('ok');
  transaction.finish();
});

bot.on('message', async (ctx) => {
  const transaction = Sentry.startTransaction({
    op: 'directMessage',
    name: 'Direct message',
  });
  const { id, username } = ctx.update.message.from;
  Sentry.setUser({ id, username });

  await ctx.reply('I am an inline bot, use me in any chat simply by entering my username @MusVertBot');

  transaction.setStatus('ok');
  transaction.finish();
});

bot.on('inline_query', async (ctx) => {
  const { query } = ctx.update.inline_query;
  if (!query) return;

  const transaction = Sentry.startTransaction({
    op: 'getSong',
    name: 'Get song',
  });

  const { id, username } = ctx.update.inline_query.from;

  Sentry.setUser({ id, username });
  Sentry.setContext('song', { url: query });

  try {
    await queryHandler(ctx);
    transaction.setStatus('ok');
  } catch (e) {
    Sentry.captureException(e);
    transaction.setStatus('not_found');
  } finally {
    transaction.finish();
  }
});

if (process.env.NODE_ENV === 'production') {
  if (!process.env.BOT_DOMAIN) {
    throw new Error('MISSING BOT DOMAIN');
  }
  bot.telegram.setWebhook(`${process.env.BOT_DOMAIN}/${process.env.BOT_TOKEN}`);
  bot.startWebhook(`/${process.env.BOT_TOKEN}`, undefined, process.env.PORT);
} else {
  bot.launch();
}

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
