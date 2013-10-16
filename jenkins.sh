#!/bin/bash
set -e

NODEENV=/var/tmp/nodeenvs/$(echo ${JOB_NAME} | tr ' ' '-')

if [ -d "$NODEENV" ]; then
    source $NODEENV/bin/activate
else
    nodeenv --node=0.10.20 $NODEENV
    source $NODEENV/bin/activate
    npm install -g grunt-cli@0.1.9
fi

npm install

npm test
