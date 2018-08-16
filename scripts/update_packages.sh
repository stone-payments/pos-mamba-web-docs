#!/bin/sh -e

# Remove packages folder
rm -rf packages

# update-submodules
#git subtree add --prefix .temp https://github.com/stone-payments/pos-mamba-sdk.git develop --squash

# mkdir packages

# cd .temp/packages/components

# mv * ../../packages

# cd ../.. && rm -rf .temp

git submodule add --force https://github.com/stone-payments/pos-mamba-sdk.git packages

cd packages

git remote rm origin

git filter-branch --subdirectory-filter packages/components -- --all

