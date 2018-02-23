#!/usr/bin/env bash

set -e

if [ -z "$1" ]; then
    echo "Missing PAAS space argument"
    echo "  deploy.sh staging|production"
    exit 1
fi

PAAS_SPACE=$1

# Install cf-cli
wget -q -O - https://packages.cloudfoundry.org/debian/cli.cloudfoundry.org.key | sudo apt-key add -
echo "deb http://packages.cloudfoundry.org/debian stable main" | sudo tee /etc/apt/sources.list.d/cloudfoundry-cli.list
sudo apt-get update && sudo apt-get install cf-cli

# Login and install the BGD plugin for the zero downtime deploy
cf login -u $PAAS_USER -p $PAAS_PASSWORD -a https://api.cloud.service.gov.uk -o gds-performance-platform -s $PAAS_SPACE
cf install-plugin blue-green-deploy -r CF-Community

# Use BGD to push the app to NAME-new and then it will be renamed to NAME once successful
cf blue-green-deploy performance-platform-spotlight-$PAAS_SPACE -f manifest.$PAAS_SPACE.yml

