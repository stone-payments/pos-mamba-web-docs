#!/bin/bash
set -e

sudo pm2 stop ecosystem.config.js

# Basically deploy do: git clean -fdx && git reset --hard HEAD && git pull origin master && cross-env NODE_ENV=production npm install --production && npm run build && pm2 restart mambadocs

### Configuration ###
SITE_DIR=/home/deployusr/site
# APP_DIR="$SITE_DIR/pos-mamba-sdk-docs"
PROD_DIR="$SITE_DIR/mambadocs-prod"
# BRANCH="develop"
export NODE_ENV=production

# cd $APP_DIR

echo pwd

set -x

if [ ! -d "$SITE_DIR/mambadocs-prod" ]; then
  mkdir "$SITE_DIR/mambadocs-prod"
fi

# # Slow deploy
# # Clear all untracked files
# sudo rm -rf __sapper__

# # Ignore remote hard-coded changes
# sudo git reset --hard ORIG_HEAD
# # sudo git checkout $BRANCH -- package-lock.json

# # Update lasted update
# sudo git pull origin $BRANCH -f

# # Remove lock if any
# sudo rm package-lock.json

# # Install dependencies
# sudo npm install
# sudo npm install immer
# sudo npm install core-js@3

# sudo chown -R $USER ./packages/
# sudo chown -R $USER $PROD_DIR

# # Build project
# sudo npm run build

# # Copy build to prod dest
# cp -rp "__sapper__" $PROD_DIR

# cp -rp "content" $PROD_DIR

# # Copy package.json
# cp -rp "./package.json" $PROD_DIR

# # Copy pm2 ecosystem
# cp -rp "./ecosystem.config.js" $PROD_DIR

# # Copy packages
# cp -rp "./packages" $PROD_DIR

# # Copy static
# cp -rp "./static" $PROD_DIR

cd $PROD_DIR
# # Install dependencies
# sudo npm install --production --ignore-scripts
# sudo npm prune --production --ignore-scripts
# sudo npm install immer
# sudo npm install core-js@3

# Replace sapper loopback address to fix direct call to site inner pages
{ sudo rm __sapper__/build/server/server.js && sudo awk '{gsub(/http\:\/\/127\.0\.0\.1/,"https://mambasdk-docs.stone.com.br/", $0); print}' > __sapper__/build/server/server.js; } < __sapper__/build/server/server.js

echo pwd

(sudo pm2 delete mambadocs || true)
sudo pm2 start ecosystem.config.js
