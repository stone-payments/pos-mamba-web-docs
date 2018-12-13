#!/bin/bash
set -e

### Configuration ###
SERVER=deployusr@191.239.252.1
SITE_DIR=/home/deployusr/site
REMOTE_GIT="ssh://$SERVER/$SITE_DIR/mambadocs.git"
# KEYFILE=
# REMOTE_SCRIPT_PATH=/tmp/deploy-mambadocs.sh
# APP_DIR="$SITE_DIR/pos-mamba-sdk-docs"

### Automation steps ###
cd $(git rev-parse --show-toplevel)

BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ "$BRANCH" != "master" ]; then
  while true; do
    read -p "Do you wish go to master branch?( Y/n ) " yn
    case $yn in
        [Yy]* ) git checkout master; break;;
        [Nn]* ) exit;;
        * ) echo "Please answer yes or no.";;
    esac
  done
fi

FORCE_REMOTE=false

while true; do
    read -p "Re-add remote url?( Y/n ) " yn
    case $yn in
        [Yy]* ) FORCE_REMOTE=true; break;;
        [Nn]* ) exit;;
        * ) echo "Please answer yes or no.";;
    esac
  done

PROD_REMOTE=$(git ls-remote --exit-code ${REMOTE_GIT})


function addRemote {
  echo "Add production remote $REMOTE_GIT"
  git remote add prod $REMOTE_GIT
}

# Remote exists - Exit script if remote does not exist
$PROD_REMOTE >/dev/null 2>&1
if [ $? -ne 0 ]; then
  addRemote
elif [ "$FORCE_REMOTE" = true ]; then
  git remote remove prod
  addRemote
fi

echo "Prod remote is: $(git config --get remote.prod.url)"

set -x
git fetch --all

HEADHASH=$(git rev-parse HEAD)
UPSTREAMHASH=$(git rev-parse prod master@{upstream})

if [ "$HEADHASH" != "$UPSTREAMHASH" ] then
  echo -e ${ERROR}Not up to date with origin. Aborting.${NOCOLOR}
  echo
  exit 0
else
  echo -e ${FINISHED}Current branch is up to date with origin/master.${NOCOLOR}
fi

echo "Updading"
git pull

git push prod master

# echo "Removing old sapper build"
# rm -rf __sapper__

# echo "Preparing and Building..."
# npm prune
# npm install
# npm run build

# function run()
# {
#   echo "Running: $@"
#   "$@"
# }


# if [[ "$KEYFILE" != "" ]]; then
#   KEYARG="-i $KEYFILE"
# else
#   KEYARG=
# fi

# run scp $KEYARG deploy/work.sh $SERVER:$REMOTE_SCRIPT_PATH
# echo
# echo "---- Running deployment script on remote server ----"
# run ssh $KEYARG $SERVER bash $REMOTE_SCRIPT_PATH

