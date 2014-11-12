#!/bin/bash
set -ex

npm install

grunt test:unit
grunt shell:cheapseats:--range:0..1
