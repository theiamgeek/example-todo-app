FROM node:12

WORKDIR /opt/todo

COPY package*.json ./

RUN apt-get install jq

RUN npm install --production

COPY lib ./lib

EXPOSE 80

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

CMD ["node", "/opt/todo/lib/server/server.js"]

