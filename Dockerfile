FROM node:12

WORKDIR /opt/todo

COPY package*.json ./

RUN npm install --production

COPY lib ./lib

ADD https://s3.amazonaws.com/rds-downloads/rds-combined-ca-bundle.pem ./

EXPOSE 80

CMD ["node", "/opt/todo/lib/server/server.js"]
