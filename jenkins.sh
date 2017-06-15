#!/bin/bash
set -e

export GOVUK_WEBSITE_ROOT=https://www.gov.uk

rm -rf ./node_modules/

npm install

npm run test:unit
npm run shell:cheapseats
