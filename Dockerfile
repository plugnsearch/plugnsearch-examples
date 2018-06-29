FROM node:10.5-alpine

ENV NODE_ENV production

VOLUME /results
VOLUME /logs

# Install zeromq for node
RUN apk add --no-cache --virtual build-dependencies make gcc g++ python && \
    apk add --no-cache krb5-dev zeromq-dev && yarn global add node-gyp

RUN apk update && \
    apk upgrade && \
    apk add git

# We dont have plugnsearch yet published
RUN git clone https://github.com/plugnsearch/plugnsearch.git /plugnsearch
WORKDIR /plugnsearch
RUN yarn install --production=false
RUN yarn link

# We dont have plugnsearch yet published
RUN git clone https://github.com/plugnsearch/plugnsearch-apps.git /plugnsearch-apps
WORKDIR /plugnsearch-apps
RUN yarn install --production=false
RUN yarn link plugnsearch
RUN yarn link

COPY . /app
WORKDIR /app

RUN yarn install --production=false
RUN yarn link plugnsearch
RUN yarn link plugnsearch-apps

CMD ["yarn", "start", "src/hackernews.js"]
