# Spotlight #

Hybrid rendering app for the GOV.UK Performance Platform using [Backbone][]
and [D3][]. JavaScript is shared between the client and server, and the app
makes use of [progressive enhancement][] to provide a great experience in
every browser.

[Backbone]: http://backbonejs.org/
[D3]: http://d3js.org/
[progressive enhancement]: https://www.gov.uk/service-manual/making-software/progressive-enhancement

## Building and running the app ##

### Development ###

**Just Spotlight:** The simplest way to get started is to run just this
app, against production data. You can run the app as follows:

```bash
npm install -g grunt-cli # install grunt globally
npm install
grunt
```

Now you should be able to connect to the app at `http://localhost:3057`.

The app uses [node-supervisor][] and [grunt-contrib-watch][] to monitor changes,
automatically restart the server and recompile Sass.

[node-supervisor]: https://github.com/isaacs/node-supervisor
[grunt-contrib-watch]: https://github.com/gruntjs/grunt-contrib-watch

By default, this will look at production data, but perhaps you want to connect
to a different data source. You can do that
by creating your own config file in `/config/config.development_personal.json` that mimics
`/config/config.development.json` with a different `backdropUrl` property. It'll be ignored by Git.

**Full stack:** if you're using our development environment then you can run all
our apps in one go and use a real database for development.
As a bonus, this will let you test the image fallbacks using the
[screenshot-as-a-service][screenshot-as-a-service] app.

First, you need to set up [the Performance Platform development environment][ppdev].

Once you've got a machine that has the required system-level dependencies, you can install
application dependencies with:

```bash
npm install
```

And finally run the application:

```bash
cd /var/apps/pp-development
bundle install # install bowler
bowl performance
```

[ppdev]: https://github.com/alphagov/pp-development
[screenshot-as-a-service]: https://github.com/alphagov/screenshot-as-a-service

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

### Heroku ###

If you want to deploy the app to Heroku, follow these instructions.

#### Create an app on Heroku

Using the web interface, or the CLI:

```bash
heroku create <app-name>
```

#### Set the app to use the node-grunt buildpack

The app runs on Heroku using [a custom buildpack for Grunt.js support][buildpack].

This means it will run the grunt commands we need to compile the app when deploying code.

```bash
 heroku config:set BUILDPACK_URL=https://github.com/mbuchetics/heroku-buildpack-nodejs-grunt.git
 ```

#### Set configuration vars

```bash
heroku config:set NODE_ENV=development # makes app run in development mode
heroku config:set npm_config_production=true # does not install dev dependencies
```

#### Deploy the code

If the code you're deploying is not in master, then you'll need to make sure you specify your local branch to push to master. Otherwise it will just deploy your local master (and probably not work as expected).

```bash
git push heroku <your-branch-name>:master
heroku open # opens the freshly deployed app in a browser
```

#### Or just...

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

If you want the Heroku app to be password-protected, set config variables as follows,
before pushing the code.

```bash
heroku config:set BASIC_AUTH_USER=xxxx
heroku config:set BASIC_AUTH_PASS=xxxx
heroku config
```

#### Logging

You might also want to enable some logging in your Heroku app to assist with debugging. You can use logentries to do that:

```bash
heroku addons:add logentries
```

You can then access the logs from your app's dashboard on Heroku (under the "Add-ons" section).

[buildpack]: https://github.com/mbuchetics/heroku-buildpack-nodejs-grunt

## App status ##

![Latest tag](https://img.shields.io/github/tag/alphagov/spotlight.svg)

[![Build status](https://travis-ci.org/alphagov/spotlight.svg?branch=master)](https://travis-ci.org/alphagov/spotlight)

[![Dependency status](https://gemnasium.com/alphagov/spotlight.svg)](https://gemnasium.com/alphagov/spotlight)
