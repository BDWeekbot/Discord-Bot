FROM node:18-alpine as base

RUN "mkdir" "-p" "/app"

COPY . /app
WORKDIR /dist

RUN "npm" "install"

RUN npm run build

ENTRYPOINT [ "node", "/dist/app.js" ]