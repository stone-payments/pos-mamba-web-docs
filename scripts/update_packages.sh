#!/bin/sh -e

# Remove packages folder
rm -rf packages

# update-submodules
git subtree add --prefix .temp https://github.com/stone-payments/pos-mamba-sdk.git develop --squash
mkdir packages
cd .temp/packages
mv * ../../packages

