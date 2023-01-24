FROM node:18-alpine
WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
RUN yarn

ENV NODE_ENV production
COPY --chown=node:node . .
RUN yarn run build

ENV PORT 3000
ENV ADDRESS "0.0.0.0"
EXPOSE 3000
EXPOSE 3001
USER node
CMD [ "yarn", "run", "start:prod" ]
