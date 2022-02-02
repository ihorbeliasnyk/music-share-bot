# [Share Music Bot](https://t.me/MusVertBot)

Telegram bot which simplifies sharing music between users of different streaming platforms. Currently this bot supports YouTube Music and Spotify

## Usage

Since it’s inline bot, you can use it in any of your chats, groups or channels – it doesn't matter, whether the bot is a member or not

![usage](/usage.gif)

## Local setup

1. Clone this repo, run `npm install`
2. Create `.env` file in root directory and fill it in like this: 

```bash
BOT_TOKEN=your telegram bot token
SPOTIFY_USERNAME=spotify app client id
SPOTIFY_PASSWORD=spotify app client secret
YT_API_KEY=youtube api key
```
3. Run `npm run devstart`
