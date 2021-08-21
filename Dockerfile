FROM node:14

ENV NODE_ENV='production'
ENV PORT='8080'

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY src ./

EXPOSE 8080

ENTRYPOINT [ "node", "bot.js" ]
