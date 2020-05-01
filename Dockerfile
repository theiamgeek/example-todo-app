FROM node:12

WORKDIR /opt/todo

COPY package*.json ./

RUN apt-get install python3

RUN npm install --production

COPY lib ./lib

EXPOSE 80

COPY entrypoint.sh /opt/todo/entrypoint.sh

ENTRYPOINT ["/opt/todo/entrypoint.sh"]

CMD ["/usr/local/bin/node", "/opt/todo/lib/server/server.js"]

