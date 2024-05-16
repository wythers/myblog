#!/usr/bin/env sh
ls /openssl/password.conf
if [ $? != 0 ]; then
   openssl rand -base64 12 > /openssl/password.conf
fi

exit 0