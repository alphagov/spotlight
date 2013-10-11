# Spotlight #

Hybrid rendering app for the GOV.UK Performance Platform


## Installation ##

This app runs inside [the Performance Platform development environment][ppdev],
not in the standard GDS development VM.

[ppdev]: https://github.com/alphagov/pp-development

Install dependencies:
```
npm install
git submodule init
```


## Running app ##

`node app/server.js`

This will run the app at `http://localhost:3000`. At the moment, you need to
restart the app for file changes to take effect.


## Running tests ##

`grunt jasmine` executes Jasmine tests in PhantomJS.

When app is running, Jasmine tests are available at `http://localhost:3000/spec`.

You need to re-run `grunt jasmine` whenever the list of spec files changes to
recreate the specrunner for use in the browser.


## Status ##

[![Build Status](https://travis-ci.org/alphagov/spotlight.png?branch=master)](https://travis-ci.org/alphagov/spotlight)

[![Dependency Status](https://gemnasium.com/alphagov/spotlight.png)](https://gemnasium.com/alphagov/spotlight)
