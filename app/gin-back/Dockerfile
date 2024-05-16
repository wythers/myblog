FROM golang:latest AS myblog-webserver
WORKDIR /usr/src/myblog/web-back
COPY .. .
RUN GOPROXY=https://goproxy.cn,direct go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -o app