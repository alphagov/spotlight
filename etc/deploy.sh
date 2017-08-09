#!/usr/bin/env bash

set -e

if [ -z "$1" ]; then
    echo "Missing PAAS space argument"
    echo "  deploy.sh staging|production"
    exit 1
fi

PAAS_SPACE=$1
docker login -u $DOCKER_USER -p $DOCKER_PASSWORD
docker build --file=$DOCKER_FILE --tag=$DOCKER_REPOSITORY/$DOCKER_IMAGE:$TRAVIS_BUILD_NUMBER .
docker push $DOCKER_REPOSITORY/$DOCKER_IMAGE:$TRAVIS_BUILD_NUMBER
wget -q -O - https://packages.cloudfoundry.org/debian/cli.cloudfoundry.org.key | sudo apt-key add -
echo "deb http://packages.cloudfoundry.org/debian stable main" | sudo tee /etc/apt/sources.list.d/cloudfoundry-cli.list
sudo apt-get update && sudo apt-get install cf-cli

cf login -u $PAAS_USER -p $PAAS_PASSWORD -a https://api.cloud.service.gov.uk -o gds-performance-platform -s $PAAS_SPACE

# set environmental variables
cf set-env $PAAS_SERVICE NODE_ENV $PAAS_SPACE
cf set-env $PAAS_SERVICE GOVUK_WEBSITE_ROOT $APP_GOVUK_WEBSITE_ROOT

# deploy apps
cf push $PAAS_SERVICE --docker-image $DOCKER_REPOSITORY/$DOCKER_IMAGE:$TRAVIS_BUILD_NUMBER

# create and map routes
cf map-route $PAAS_SERVICE cloudapps.digital --hostname $PAAS_SERVICE-$PAAS_SPACE
