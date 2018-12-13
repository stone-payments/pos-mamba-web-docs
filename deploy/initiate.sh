#!/bin/bash
set -e

### Configuration ###
SERVER=deployusr@191.239.252.1
SITE_DIR="$HOME/site"
# KEYFILE=
# REMOTE_SCRIPT_PATH=/tmp/deploy-mambadocs.sh
# APP_DIR="$SITE_DIR/pos-mamba-sdk-docs"

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

echo "Add production remote ${"ssh://$SERVER/$SITE_DIR/mambadocs.git"}"
git remote add prod "ssh://$SERVER/$SITE_DIR/mambadocs.git"


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

