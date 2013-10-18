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

If you're using our dev environment then `cd /var/apps/pp-development` and
`bowl performance`. Once you've set up your DNS, `http://spotlight.perfplat.dev`
will work.

Otherwise...
```bash
cd <spotlight_dir>
grunt
```

This will create a development build of the assets and then run the app at
`http://localhost:3057`.

The app uses [grunt-nodemon](https://github.com/ChrisWren/grunt-nodemon) and
[grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch) to monitor
changes and automatically restart the server and recompile SASS.

#### Running tests ####

* Jasmine unit tests: `grunt jasmine`
* Cucumber functional tests: `grunt cucumber`
* Cucumber tests in sauce: `bundle exec cucumber --profile sauce` (no grunt task yet)
* All tests: `grunt test:all`

When the app is running in development mode, Jasmine tests are available at
`http://localhost:3000/spec`. You need to re-run `grunt jasmine` whenever the
list of spec files changes to recreate the specrunner for use in the browser.

### Production ###

`grunt build:production` to create a production release.

`NODE_ENV=production node app/server.js` to run the app in production mode.

## Status ##

[![Build Status](https://travis-ci.org/alphagov/spotlight.png?branch=master)](https://travis-ci.org/alphagov/spotlight)

[![Dependency Status](https://gemnasium.com/alphagov/spotlight.png)](https://gemnasium.com/alphagov/spotlight)
