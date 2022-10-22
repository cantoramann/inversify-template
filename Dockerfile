FROM node:16.16-alpine

ARG NODE_ENV=production

ARG BUILD_PORT $BUILD_PORT

ENV NODE_ENV $NODE_ENV

WORKDIR /home/node/app

COPY package.json ./

COPY yarn.lock ./

RUN yarn --frozen-lock

# RUN yarn build

COPY ./ ./

RUN yarn build

EXPOSE $BUILD_PORT

USER node

CMD ["yarn", "start"]