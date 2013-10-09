# Spotlight #

Hybrid rendering app for the GOV.UK Performance Platform


## Installation ##

This app will run inside [the Performance Platform development environment][ppdev],
not in the standard GDS development VM.

For now, you can follow the instructions below to install using `apt`. This will
get handled by Puppet in the future.

[ppdev]: https://github.com/alphagov/pp-development

### Ubuntu ###

Follow the [instructions](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager) to install Node.js:

```
sudo apt-get update
sudo apt-get install python-software-properties python g++ make
sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install nodejs
```

Install grunt-cli:
`sudo npm install -g grunt-cli`

Install dependencies:
`npm install`


## Running app ##

`node app/server.js`

This will run the app at `http://localhost:3000`. At the moment, you need to
restart the app for file changes to take effect.


## Running tests ##

`grunt jasmine` executes Jasmine tests in PhantomJS.

When app is running, Jasmine tests are available at `http://localhost:3000/spec`.

You need to re-run `grunt jasmine` whenever the list of spec files changes to
recreate the specrunner for use in the browser.
