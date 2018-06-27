FROM node:10-alpine
MAINTAINER davesag@gmail.com

WORKDIR /davesag/mock-sign-in-with-slack

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install

COPY src src
COPY index.js index.js

EXPOSE 8282
ENTRYPOINT ["npm" , "start" ]
