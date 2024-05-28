FROM golang:alpine as build
WORKDIR /tmp/go
COPY . .
RUN go build cmd/desafio-go/main.go

FROM scratch
COPY --from=build /tmp/go/main .
CMD ["/main"]