# Spotlight #

Hybrid rendering app for the GOV.UK Performance Platform using [Backbone][]
and [D3][]. JavaScript is shared between the client and server, and the app
makes use of [progressive enhancement][] to provide a great experience in
every browser.

[Backbone]: http://backbonejs.org/
[D3]: http://d3js.org/
[progressive enhancement]: https://www.gov.uk/service-manual/making-software/progressive-enhancement.html

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

## Building and running the app ##

### Development ###

If you're using our dev environment then `cd /var/apps/pp-development` and
`bowl performance`. Once you've set up your DNS, `http://spotlight.perfplat.dev`
will work.

Otherwise...
```bash
cd <spotlight_dir>
node app/server.js --backdropUrl='http://localhost:3057/backdrop-stub/{{ data-group }}/{{ data-type }}'
grunt
```

This will create a development build of the assets and then run the app at
`http://localhost:3057`.

If you want to test with png rendering run the [screenshot-as-a-service][] app first in the appropriate environment.

[screenshot-as-a-service]: https://github.com/alphagov/screenshot-as-a-service

The app uses [grunt-nodemon][] and [grunt-contrib-watch][] to monitor changes,
automatically restart the server and recompile Sass.

[grunt-nodemon]: https://github.com/ChrisWren/grunt-nodemon
[grunt-contrib-watch]: https://github.com/gruntjs/grunt-contrib-watch

### Running tests ###

#### Command line ####

Tests are divided into ones that work on both client and server (`test/spec/shared`) and ones that are server-only (`test/spec/server`) and client-only (`test/spec/client`).

`grunt test:all` runs all three of these tests in sequence:

- `grunt jasmine_node` executes shared and server Jasmine tests in Node.js.
- `grunt jasmine` executes shared and client Jasmine tests in PhantomJS.
- `grunt cucumber` executes Cucumber features through PhantomJS.

`bundle exec cucumber --profile sauce` executes Cucumber features through
SauceLabs (no Grunt task yet).

#### Browser ####

When the app is running in development mode, Jasmine tests for shared
components are available at `/spec`. The specrunner gets automatically
recreated on server start and when the specfiles change. Due to a
[bug in grunt-contrib-watch][watch-20], new spec files are not currently
detected automatically. When you add a new spec file, either restart the
app or run `grunt jasmine:spotlight:build`.

[watch-20]: https://github.com/gruntjs/grunt-contrib-watch/issues/20

#### Debugging locally ####

Install node-inspector on your VM with `sudo npm install -g node-inspector@0.5.0`
and run it with `node-inspector`.

Start the app with `node --debug app/server.js`.

Visit `http://spotlight.perfplat.dev:8080` to view the console.


### Production ###

`grunt build:production` to create a production release.

`NODE_ENV=production node app/server.js` to run the app in production mode.

## Status ##

[![Build Status](https://travis-ci.org/alphagov/spotlight.png?branch=master)](https://travis-ci.org/alphagov/spotlight)

[![Dependency Status](https://gemnasium.com/alphagov/spotlight.png)](https://gemnasium.com/alphagov/spotlight)
