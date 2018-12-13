#!/bin/bash
set -e

# Basically deploy do: git clean -fdx && git reset --hard HEAD && git pull origin master && cross-env NODE_ENV=production npm install --production && npm run build && pm2 restart mambadocs

### Configuration ###
export NODE_ENV=production


### Automation steps ###


cd $(git rev-parse --show-toplevel)

while true; do
    read -p "Do you wish go to master branch?( Y/n ) " yn
    case $yn in
        [Yy]* ) git checkout master; break;;
        [Nn]* ) exit;;
        * ) echo "Please answer yes or no.";;
    esac
done

set -x

git pull


# Install dependencies
npm install --production
npm prune --production

# Restart app
