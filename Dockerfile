FROM node:14

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

ENTRYPOINT [ "node", "src/bot.js" ]