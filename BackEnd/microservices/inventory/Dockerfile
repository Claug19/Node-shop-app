FROM node:lts-alpine3.14
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm install --production

COPY . .

EXPOSE 8000
CMD ["node", "server.js"]