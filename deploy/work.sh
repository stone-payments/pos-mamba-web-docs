#!/bin/bash
set -e

# Basically deploy do: git clean -fdx && git reset --hard HEAD && git pull origin master && cross-env NODE_ENV=production npm install --production && npm run build && pm2 restart mambadocs

### Configuration ###
export NODE_ENV=production
SITE_DIR=~deployusr/site
APP_DIR="$SITE_DIR/pos-mamba-sdk-docs"
PROD_DIR="$SITE_DIR/mambadocs-prod/"

cd $APP_DIR

set -x

# Slow deploy
# Clear all untracked files
sudo rm -rf __sapper__

# Ignore remote hard-coded changes
sudo git reset --hard HEAD

# Update lasted update
sudo git pull origin master -f

# Install dependencies
npm install

# Build project
npm run build

if [ ! -d "$SITE_DIR/mambadocs-prod" ]; then
  mkdir "$SITE_DIR/mambadocs-prod"
fi


# Copy build to prod dest
cp -rp "__sapper__" $PROD_DIR

# Copy package.json 
cp -rp "./package.json" $PROD_DIR

# Copy pm2 ecosystem
cp -rp "./ecosystem.config.js" $PROD_DIR

# Copy packages
cp -rp "./packages" $PROD_DIR

# Copy static
cp -rp "./static" $PROD_DIR

cd $PROD_DIR
# Install dependencies
npm install --production --ignore-scripts
npm prune --production --ignore-scripts

(pm2 delete mambadocs || true)
pm2 start npm --name mambadocs -- start
