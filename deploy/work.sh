#!/bin/bash
set -e

# Basically deploy do: git clean -fdx && git reset --hard HEAD && git pull origin master && cross-env NODE_ENV=production npm install --production && npm run build && pm2 restart mambadocs

### Configuration ###
export NODE_ENV=production
APP_DIR=~deployusr/site/pos-mamba-sdk-docs

cd $(APP_DIR)

# Install dependencies
npm install --production
npm prune --production

# Restart app

pm2 restart mambadocs