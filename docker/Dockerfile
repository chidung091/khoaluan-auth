FROM node:14-alpine as builder

ENV NODE_ENV prod

WORKDIR /home/node

COPY ./ .

RUN yarn install && yarn run build


CMD ["node", "dist/main.js"]
