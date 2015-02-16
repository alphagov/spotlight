#!/bin/bash

echo "Downloading phantomjs 2.0"
cd tests
cd tools
curl -L -O 'https://www.dropbox.com/s/zqxb0wj2sfntsz8/phantomjs'
chmod +x ./phantomjs
cd ../../