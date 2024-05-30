FROM nginx:stable

ENV WAIT_FOR_VERSION 2.2.4
ENV WAIT_FOR_LOCAL_PATH /usr/local/bin/wait-for

RUN apt-get update && \
    apt-get install -y wget && \
    apt-get install -y netcat-traditional && \
    wget -q -O ${WAIT_FOR_LOCAL_PATH} https://raw.githubusercontent.com/eficode/wait-for/v${WAIT_FOR_VERSION}/wait-for && \
    chmod +x ${WAIT_FOR_LOCAL_PATH}

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]