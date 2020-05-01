FROM node:12

WORKDIR /opt/todo

COPY package*.json ./

RUN npm install --production

COPY lib ./lib

EXPOSE 80

#CMD ["node", "/opt/todo/lib/server/server.js"]
CMD ["printenv", "MONGO_DB_URL"]
