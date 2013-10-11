#!/bin/bash
set -e

npm install -g grunt-cli@0.1.9
npm install
git submodule init
git submodule update

npm test
