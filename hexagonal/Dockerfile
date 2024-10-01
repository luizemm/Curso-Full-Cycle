FROM golang:1.23.1

WORKDIR /go/src
ENV PATH="/go/bin:${PATH}"

RUN apt-get update && \
    apt-get install sqlite3 -y && \
    apt-get clean && \
    usermod -u 1000 www-data && \
    mkdir -p /var/www/.cache && \
    chown -R www-data:www-data /go && \
    chown -R www-data:www-data /var/www/.cache

COPY --chown=www-data:www-data go.mod go.mod

RUN go get -u github.com/spf13/cobra@latest && \
    go install go.uber.org/mock/mockgen@latest && \
    go install github.com/spf13/cobra-cli@latest

USER www-data

CMD ["tail", "-f", "/dev/null"]