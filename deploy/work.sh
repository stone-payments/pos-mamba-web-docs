#!/bin/bash

set -x

rm package-lock.json
rm -rf node_modules

set -e

export NODE_ENV=production

# Update lasted update
git pull
git submodule sync --recursive

npm run pull:sdk:submodule

sudo chown -R $USER ./mamba-sdk/

# Install dependencies and submodule sdk
npm i

# Build project
npm run build

# Replace sapper loopback address to fix direct call to site inner pages
{ rm __sapper__/build/server/server.js && awk '{gsub(/http:\/\/127\.0\.0\.1/,"https://mambasdk-docs.stone.com.br/", $0); print}' > __sapper__/build/server/server.js; } < __sapper__/build/server/server.js

pm2 restart ecosystem.config.js
