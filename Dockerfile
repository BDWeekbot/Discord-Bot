FROM node:18-alpine as base

RUN "mkdir" "-p" "/app"

COPY . /app
WORKDIR /app

RUN "npm" "install"

RUN npm run build

RUN chmod +x dist/setCommands.js
RUN npm run dc-live

ENTRYPOINT [ "node", "dist/app.js" ]