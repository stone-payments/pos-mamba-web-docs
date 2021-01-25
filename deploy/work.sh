#!/bin/bash
set -e
set -x

export NODE_ENV=production

echo pwd

# Update lasted update
git pull

# Install dependencies and submodule sdk
npm ci

chown -x $USER ./mamba-sdk/

# Build project
npm run build

# Replace sapper loopback address to fix direct call to site inner pages
{ rm __sapper__/build/server/server.js && awk '{gsub(/http\:\/\/127\.0\.0\.1/,"https://mambasdk-docs.stone.com.br/", $0); print}' > __sapper__/build/server/server.js; } < __sapper__/build/server/server.js

echo pwd

pm2 restart ecosystem.config.js
