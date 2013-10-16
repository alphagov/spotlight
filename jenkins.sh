#!/bin/bash
set -e

npm install
git submodule init
git submodule update

npm test
