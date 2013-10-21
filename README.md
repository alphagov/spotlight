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

If you're using the PP dev environment `cd /var/apps/pp-development` and then
`bowl performance`. If you've set up your DNS, `http://spotlight.dev.gov.uk`
will work.

Otherwise...
```bash
cd <spotlight_dir>
grunt
```

This will create a development build of the assets and then run the app at
`http://localhost:3057`.

The app uses [grunt-nodemon](https://github.com/ChrisWren/grunt-nodemon) and [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch) to monitor changes and automatically restart the server and recompile SASS.

### Running tests ###


#### Command line ####

Tests are divided into ones that work on both client and server (`test/spec/shared`) and ones that are server-only (`test/spec/server`).

`grunt jasmine_node` executes shared and server Jasmine tests in Node.js.
`grunt jasmine` executes shared Jasmine tests in PhantomJS.
`grunt cucumber` executes Cucumber features through PhantomJS.

`grunt test:all` runs all tests.


#### Browser ####

When the app is running in development mode, Jasmine tests for shared components are available at `/spec`. The specrunner gets automatically recreated on server start and when the specfiles change. Due to a [bug in grunt-contrib watch](https://github.com/gruntjs/grunt-contrib-watch/issues/20), new spec files are not currently detected automatically. When you add a new spec file, either restart the app or run `grunt jasmine:spotlight:build`.

### Production ###

`grunt build:production` to create a production release.

`NODE_ENV=production node app/server.js` to run the app in production mode.

## Status ##

[![Build Status](https://travis-ci.org/alphagov/spotlight.png?branch=master)](https://travis-ci.org/alphagov/spotlight)

[![Dependency Status](https://gemnasium.com/alphagov/spotlight.png)](https://gemnasium.com/alphagov/spotlight)
