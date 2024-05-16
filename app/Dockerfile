FROM node:latest AS myblog-front
WORKDIR /usr/src/myblog/front
COPY react-front .
RUN npm config set registry https://registry.npmmirror.com
RUN npm install
RUN npm run build

FROM golang:latest AS myblog-webserver
WORKDIR /usr/src/myblog/web-back
COPY gin-back .
RUN GOPROXY=https://goproxy.cn,direct go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -o app

FROM alpine
WORKDIR /static
COPY --from=myblog-front /usr/src/myblog/front/dist .
COPY --from=myblog-front /usr/src/myblog/front/imgs imgs
WORKDIR /app
COPY --from=myblog-webserver /usr/src/myblog/web-back/app .
ENTRYPOINT [ "./app" ]