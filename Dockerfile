FROM node:18-buster
LABEL maintainer="davesag@gmail.com"
EXPOSE 8282

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

COPY --chown=node:node package.json index.js ./
COPY --chown=node:node src/ ./src/

ENV NODE_PATH .
ENV NODE_ENV production
ENV HUSKY_SKIP_INSTALL true

USER node

RUN npm install --omit=dev

ENTRYPOINT ["node" , " index.js" ]
