#!/bin/bash
set -e

npm install

npm run test:unit
npm run shell:cheapseats
