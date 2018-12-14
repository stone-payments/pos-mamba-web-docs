#!/bin/bash
set -e

# Basically deploy do: git clean -fdx && git reset --hard HEAD && git pull origin master && cross-env NODE_ENV=production npm install --production && npm run build && pm2 restart mambadocs

### Configuration ###
SITE_DIR=~deployusr/site
APP_DIR="$SITE_DIR/pos-mamba-sdk-docs"
PROD_DIR="$SITE_DIR/mambadocs-prod/"
export NODE_ENV=production

cd $APP_DIR

echo pwd

set -x

if [ ! -d "$SITE_DIR/mambadocs-prod" ]; then
  mkdir "$SITE_DIR/mambadocs-prod"
else
  sudo rm -rf "$PROD_DIR/__sapper__"
  sudo rm -rf "$PROD_DIR/packages"
fi

# Slow deploy
# Clear all untracked files
sudo rm -rf __sapper__

# Ignore remote hard-coded changes
# sudo git reset --hard HEAD
sudo git checkout master -- package-lock.json

# Update lasted update
sudo git pull origin master -f

# Install dependencies
sudo npm install -verbose

# Build project
sudo npm run build


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
sudo npm install --production --ignore-scripts
sudo npm prune --production --ignore-scripts

(pm2 delete mambadocs || true)
pm2 start ecosystem.config.js
