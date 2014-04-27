# Spotlight #

Hybrid rendering app for the GOV.UK Performance Platform using [Backbone][]
and [D3][]. JavaScript is shared between the client and server, and the app
makes use of [progressive enhancement][] to provide a great experience in
every browser.

[Backbone]: http://backbonejs.org/
[D3]: http://d3js.org/
[progressive enhancement]: https://www.gov.uk/service-manual/making-software/progressive-enhancement

## Installation ##

This app runs inside [the Performance Platform development environment][ppdev],
not in the standard GDS development VM.

[ppdev]: https://github.com/alphagov/pp-development

Once you've got a machine that has the required system-level dependencies, you can install
application dependencies with:

```bash
npm install
```

## Building and running the app ##

### Development ###

**Full stack:** if you're using our development environment then you can run all our apps in one go and use a real database for development.
As a bonus, this will let you test the image fallbacks using the [screenshot-as-a-service][] app.

[screenshot-as-a-service]: https://github.com/alphagov/screenshot-as-a-service

```bash
cd /var/apps/pp-development
bundle install # install bowler
bowl performance
```

**Just Spotlight:** if you want to only run this app, that's fine too.

```bash
cd /var/apps/spotlight
grunt
```

Perhaps you want to run just the Spotlight app and connect to a different data source. You can do that
by creating your own config file in `/config/config.development_personal.json` that mimics
`/config/config.development.json` with a different `backdropUrl` property. It'll be ignored by Git.

Once you've set up your DNS, `http://spotlight.perfplat.dev`
will connect to the app (which is running on port 3057).

The app uses [node-supervisor][] and [grunt-contrib-watch][] to monitor changes,
automatically restart the server and recompile Sass.

[node-supervisor]: https://github.com/isaacs/node-supervisor
[grunt-contrib-watch]: https://github.com/gruntjs/grunt-contrib-watch

### Running tests ###

#### Command line ####

Tests are divided into ones that work on both client and server (`test/spec/shared`), ones that are server-only (`test/spec/server`) and ones that are client-only (`test/spec/client`).

`grunt test:all` runs all three of these tests, as well as linting the codebase:

- `grunt jasmine_node` executes shared and server Jasmine tests in Node.js
- `grunt jasmine` executes shared and client Jasmine tests in PhantomJS
- `grunt shell:cheapseats` executes feature tests using [cheapseats][]

[cheapseats]: https://github.com/alphagov/cheapseats

#### In the browser ####

When the app is running in development mode, Jasmine tests for shared
components are available at `/tests`. The specrunner gets automatically
recreated on server start and when the specfiles change. Due to a
[bug in grunt-contrib-watch][watch-20], new spec files are not currently
detected automatically. When you add a new spec file, either restart the
app or run `grunt jasmine:spotlight:build`.

[watch-20]: https://github.com/gruntjs/grunt-contrib-watch/issues/20

#### Debugging locally ####

Install node-inspector where the app runs with `sudo npm install -g node-inspector@0.5.0`
and run it with `node-inspector`.

Start the app with `node --debug app/server.js` and visit `http://spotlight.perfplat.dev:8080/debug`
to view the console.

### Production ###

`grunt build:production` to create a production release.

`NODE_ENV=production node app/server.js` to run the app in production mode.

## App status ##

![Latest tag](https://img.shields.io/github/tag/alphagov/spotlight.svg)

[![Build status](https://travis-ci.org/alphagov/spotlight.svg?branch=master)](https://travis-ci.org/alphagov/spotlight)

[![Dependency status](https://gemnasium.com/alphagov/spotlight.svg)](https://gemnasium.com/alphagov/spotlight)
