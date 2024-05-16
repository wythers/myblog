FROM alpine/openssl AS crypted

WORKDIR /openssl
COPY docker-entrypoint.sh /
ENTRYPOINT ["/docker-entrypoint.sh"]
