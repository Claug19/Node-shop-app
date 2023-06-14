FROM mhart/alpine-node:7.10.1

WORKDIR /srv
ADD . .
RUN npm install
RUN apk update
RUN apk add jq

EXPOSE 3000
CMD ["node", "server.js"]