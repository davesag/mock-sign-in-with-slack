FROM node:12-alpine
MAINTAINER davesag@gmail.com

WORKDIR /davesag/mock-sign-in-with-slack

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN HUSKY_SKIP_INSTALL=true npm install --production

COPY src src
COPY index.js index.js

EXPOSE 8282
ENTRYPOINT ["npm" , "start" ]
