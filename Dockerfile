FROM node:12

WORKDIR /opt/todo

COPY package*.json ./

RUN npm install --production

COPY lib ./lib

EXPOSE 80

CMD ["node", ./lib/server/server.js]

