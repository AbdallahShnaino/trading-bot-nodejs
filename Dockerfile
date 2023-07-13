FROM node:slim

RUN mkdir -p /usr/src/app

WORKDIR  /usr/src/app

RUN apt-get update && \
apt-get install -y \
build-essential

COPY package.json /usr/src/app

RUN npm install

COPY . /usr/src/app

ARG DEFAULT_PORT=8080

ENV PORT=$DEFAULT_PORT

# VOLUME [ "/ /usr/src/app/node_modules" ]

EXPOSE $PORT

CMD ["npm", "start"] 
