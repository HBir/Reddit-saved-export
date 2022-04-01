#!/usr/bin/env bash

read -r -d '' DEFALT_ENV <<- EOM
# Reddit app credentials
userAgent=
clientId=
clientSecret=
username=
password=

# Config
REDDIT_CACHE_TTL=3600000
OUT_PATH=
EOM

mkdir -p out
mkdir -p ./resources
[ ! -s ./resources/cache.json ] && printf '{}' > ./resources/cache.json || true
[ ! -s ./resources/files_done.json ] && printf '{}' > ./resources/files_done.json || true
[ ! -s ./resources/files_failed.json ] && printf '{}' > ./resources/files_failed.json || true
[ ! -s ./.env ] && echo "$DEFALT_ENV" > ./.env || true