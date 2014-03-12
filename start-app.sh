#!/bin/bash

echo "Installing Node.js and Ruby dependencies..."
npm install --quiet
bundle install --quiet

NODE_ENV=development_bowl_vm exec grunt
