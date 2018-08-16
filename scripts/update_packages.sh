#!/bin/sh -e

# remove .temp if already exist
rm -rf .temp

# Remove packages folder
rm -rf packages
  
  # Using subtree
    
    # git subtree add --prefix .temp https://github.com/stone-payments/pos-mamba-sdk.git develop --squash

    # mkdir packages

    # cd .temp/packages/components

    # mv * ../../packages

    # cd ../.. && rm -rf .temp

git pull --recurse-submodules
# git submodule add --force https://github.com/stone-payments/pos-mamba-sdk.git packages

cd packages

# git remote rm origin

  # Using filter-branch(will keep history from another branch)
    # git filter-branch --subdirectory-filter packages/components -- --all

# Using moving folder around
mkdir ../.temp

mv packages/components/* ../.temp

# Remove undesired files
find . -name ._\* -print0 | xargs -0 rm -f
rm -rf *
rm -rf .[^.]* ..?*

mv ../.temp/* ./

# remove our .temp folder
rm -rf ../.temp
