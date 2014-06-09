#!/bin/bash

echo "Installing dependencies from npm..."
npm install --quiet

exec grunt
