# Spotlight #

Hybrid rendering app for the GOV.UK Performance Platform

## Installation ##

This app runs inside [the Performance Platform development environment][ppdev],
not in the standard GDS development VM.

[ppdev]: https://github.com/alphagov/pp-development

We use [nodeenv][nodeenv] to contain our dependencies.

[nodeenv]: https://github.com/ekalinin/nodeenv

Create a new nodeenv with `nodeenv ~/.nodeenvs/spotlight --node=0.10.20` or
activate an existing one with `source ~/.nodeenvs/spotlight/bin/activate`.

Once you're in the nodeenv, install dependencies:

```bash
bundle install # (Ruby, so not affected by the nodeenv)
npm install -g grunt-cli@0.1.9
npm install
```

## Building and running app ##

### Development ###

First, you need to create a development build of the assets:

```bash
cd <spotlight_dir>
grunt
```

If you're using the PP dev environment `cd /var/apps/pp-development` and then
`bowl performance`. If you've set up your DNS, `http://spotlight.dev.gov.uk`
will work.

Otherwise...
```bash
node app/server.js
```

This will run the app at
`http://localhost:3057`.

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
