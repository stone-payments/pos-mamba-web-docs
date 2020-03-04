#!/bin/bash
set -e

### Configuration ###
SERVER=deployusr@191.239.252.1
SITE_DIR=/home/deployusr/site
PROD_DIR=$SITE_DIR/mambadocs-prod
REMOTE_GIT="ssh://$SERVER/$SITE_DIR/mambadocs.git"
# KEYFILE=
REMOTE_SCRIPT_PATH="$SITE_DIR/deploy-mambadocs.sh"
# APP_DIR="$SITE_DIR/pos-mamba-sdk-docs"

### Automation steps ###
cd $(git rev-parse --show-toplevel)

BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ "$BRANCH" != "master" ]; then
  while true; do
    read -p "Do you wish go to master branch? ( Y/n ) " yn
    case $yn in
        [Yy]* ) git checkout master; break;;
        [Nn]* ) break;;
        * ) echo "Please answer yes or no.";;
    esac
  done
fi

# set -x

rsync -arvc ./__sapper__ $SERVER:$PROD_DIR
rsync -arvc ./content $SERVER:$PROD_DIR
rsync -arvc ./static $SERVER:$PROD_DIR
rsync -arvc ./mamba-sdk $SERVER:$PROD_DIR

echo "Coping deploy script to ${SERVER}$REMOTE_SCRIPT_PATH"

scp deploy/work.sh $SERVER:$REMOTE_SCRIPT_PATH
echo
echo "---- Running deployment script on remote server ----"
ssh $SERVER bash $REMOTE_SCRIPT_PATH

