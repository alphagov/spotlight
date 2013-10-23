#!/bin/bash
set -e

npm install
bundle install

npm test
