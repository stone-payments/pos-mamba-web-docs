#!/bin/sh -e


echo "-> Remove .temp if already exist"
rm -rf .temp

echo "-> Remove packages folder"
rm -rf packages
  
  # Using subtree
    
    # git subtree add --prefix .temp https://github.com/stone-payments/pos-mamba-sdk.git develop --squash

    # mkdir packages

    # cd .temp/packages/components

    # mv * ../../packages

    # cd ../.. && rm -rf .temp

echo "-> Pulling submodules"
git pull --recurse-submodules
# git submodule add --force https://github.com/stone-payments/pos-mamba-sdk.git packages

cd packages

# git remote rm origin

  # Using filter-branch(will keep history from another branch)
    # git filter-branch --subdirectory-filter packages/components -- --all


echo "-> Using moving folder around"
mkdir ../.temp
mkdir ../.temp/pos
mkdir ../.temp/store

mv packages/pos/* ../.temp/pos
mv packages/store/* ../.temp/store
mv packages/components/* ../.temp

# echo "-> Remove undesired files";
find . -name ._\* -print0 | xargs -0 rm -f
rm -rf *
rm -rf .[^.]* ..?*

mv ../.temp/* ./

# echo "-> Lowering case"
# for fd in */; do fd_lower=$(printf %s "$fd" | tr A-Z a-z) && [ "$fd" != "$fd_lower" ] && mv "$fd" "$fd_lower"; done

echo "-> Finishing"
# remove our .temp folder
rm -rf ../.temp
