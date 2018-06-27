FROM node:10-alpine
MAINTAINER david.sag@industrie.co

WORKDIR /InformationDisorderProject/services/api-gateway

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install

COPY src src
COPY tasks tasks
# COPY seed-data seed-data
COPY config config
COPY index.js index.js
COPY .sequelizerc .sequelizerc
# COPY .env .env

EXPOSE 9000
ENTRYPOINT ["npm" , "start" ]
