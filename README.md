# Spotlight #

Hybrid rendering app for the GOV.UK Performance Platform

## Installation ##

This app runs inside [the Performance Platform development environment][ppdev],
not in the standard GDS development VM.

[ppdev]: https://github.com/alphagov/pp-development

Install dependencies:

```bash
bundle install
sudo npm install -g grunt-cli@0.1.9
npm install
```

## Building and running app ##

### Development ###

```bash
grunt && node app/server.js
```

This will create a development build and then run the app at
`http://localhost:3000`.

At the moment, you need to restart the app for file changes to take effect.

#### Running tests ####

`grunt jasmine` to execute Jasmine tests in PhantomJS.

When the app is running in development mode, Jasmine tests are available at
`http://localhost:3000/spec`. You need to re-run `grunt jasmine` whenever the
list of spec files changes to recreate the specrunner for use in the browser.

### Production ###

`grunt build:production` to create a production release.

`NODE_ENV=production node app/server.js` to run the app in production mode.

## Status ##

[![Build Status](https://travis-ci.org/alphagov/spotlight.png?branch=master)](https://travis-ci.org/alphagov/spotlight)

[![Dependency Status](https://gemnasium.com/alphagov/spotlight.png)](https://gemnasium.com/alphagov/spotlight)
