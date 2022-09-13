FROM node:18-alpine

RUN "mkdir" "-p" "/app"

COPY . /app
WORKDIR /app

RUN "npm" "install"

ENTRYPOINT [ "node", "/app/src/app.js" ]