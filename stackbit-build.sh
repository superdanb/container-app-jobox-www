#!/usr/bin/env bash

set -e
set -o pipefail
set -v

curl -s -X POST https://api.stackbit.com/project/5dde662c905f7e001920596a/webhook/build/pull > /dev/null
npx @stackbit/stackbit-pull --stackbit-pull-api-url=https://api.stackbit.com/pull/5dde662c905f7e001920596a
curl -s -X POST https://api.stackbit.com/project/5dde662c905f7e001920596a/webhook/build/ssgbuild > /dev/null
npm run build
curl -s -X POST https://api.stackbit.com/project/5dde662c905f7e001920596a/webhook/build/publish > /dev/null
