#!/bin/bash
#
# Upstart wrapper to start the server
#
NODE_VERSION=$(node --version)
if [[ ! "$NODE_VERSION" =~ ^v0\.10 ]]; then
  echo Unknown node version: $NODE_VERSION
  exit 1
fi
cd $(dirname $0)
sudo -u ubuntu git pull origin production
cd application
node app.js development 80
