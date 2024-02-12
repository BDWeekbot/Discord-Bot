FROM node:18-alpine as base

RUN "mkdir" "-p" "/app"

COPY . /app
WORKDIR /app

RUN npm install
RUN npm run build
RUN npm run dc-live

ENTRYPOINT [ "node", "dist/app.js" ]