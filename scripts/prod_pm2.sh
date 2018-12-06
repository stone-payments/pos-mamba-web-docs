#!/bin/bash

sudo git clean -fdx && sudo git pull origin master && npm i && npm run build && pm2 start