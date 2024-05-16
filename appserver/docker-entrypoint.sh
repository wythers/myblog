#!/usr/bin/env sh
set -eu

envsubst '${REPOSITORY_URI}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

exec "$@"