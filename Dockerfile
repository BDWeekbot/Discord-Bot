FROM node:18-alpine

RUN "mkdir" "-p" "/app"

COPY . /app

ENTRYPOINT [ "node", "/app/src/app.js" ]