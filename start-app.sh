#!/bin/bash

echo "Installing dependencies from npm..."
npm install --quiet

NODE_ENV=development_bowl_vm exec grunt
