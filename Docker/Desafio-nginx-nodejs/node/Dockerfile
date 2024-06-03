FROM node:20.14.0-alpine

WORKDIR /usr/node/app

ENV WAIT_FOR_VERSION 2.2.4
ENV WAIT_FOR_LOCAL_PATH /usr/local/bin/wait-for

COPY package*.json .
RUN npm install

COPY . .

RUN mv ./bin/app-entrypoint.sh /usr/local/bin/app-entrypoint.sh && \
    chmod +x /usr/local/bin/app-entrypoint.sh

RUN wget -q -O ${WAIT_FOR_LOCAL_PATH} https://raw.githubusercontent.com/eficode/wait-for/v${WAIT_FOR_VERSION}/wait-for && \
    chmod +x ${WAIT_FOR_LOCAL_PATH}

EXPOSE 3000

CMD ["node", "src/index.js"]