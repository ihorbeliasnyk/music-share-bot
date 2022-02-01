const { Telegraf } = require('telegraf');
const Sentry = require('@sentry/node');
// eslint-disable-next-line no-unused-vars
const Tracing = require('@sentry/tracing');

const {
  VIDEO_TUTORIAL_ID,
  VIDEO_TUTORIAL_CAPTION,
  RUSSIAN_HELP_TEXT,
  ENGLISH_HELP_TEXT,
  CHAT_INVITE_TEXT,
  SENTRY_DSN,
} = require('./constants');

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
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
  maxBreadcrumbs: 3,
});

bot.on('message', async (ctx) => {
  const transaction = Sentry.startTransaction({
    op: 'directMessage',
    name: 'Direct message',
  });

  const { id, username } = ctx.update.message.from;
  const { text } = ctx.update.message;
  Sentry.setUser({ id, username });
  Sentry.setContext('message', { text });

  await ctx.reply(RUSSIAN_HELP_TEXT);
  await ctx.reply(ENGLISH_HELP_TEXT);
  await ctx.reply(CHAT_INVITE_TEXT);
  await ctx.replyWithVideo(VIDEO_TUTORIAL_ID, { caption: VIDEO_TUTORIAL_CAPTION });

  transaction.setStatus('ok');
  transaction.finish();
  Sentry.setContext('message', null);
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
    Sentry.setContext('song', null);
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
