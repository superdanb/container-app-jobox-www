#!/usr/bin/env bash
npm install
node ./build.js
export APP_ARTIFACTS="$PWD/public"
