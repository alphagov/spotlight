# Spotlight

Note: this is a summary of a presentation given about spotlight on 2014-08-21. The information below may no longer be up-to-date.

## What is spotlight?

An application that takes datasets and turns them into graphs.

More specifically, it's the software that serves the web front-end of [gov.uk/performance](https://gov.uk/performance).

### Technology

* Node.js
* Express
* Backbone
* D3
* requirejs
* Grunt

Probably the most important of these is Backbone, since most of the application codebase is in the form of extensions of Backbone classes.

## File structure

The code to actually run spotlight lives inside the /app directory, and the important things in here are the following directories.

* app/client
* app/common
* app/extensions
* app/server

Client and server directories contain code that is executed exclusively on each environment respectively.

Common directory contains code that is shared between both client and server.

Extensions directory contains base classes from which classes in the other directories inherit/extend.

Other than this, things should be reasonably self explanatory:

* spec/ contains test scripts and helpers
* schema/ contains JSON schema for validating dashboard configs
* tools/ contains build scripts and utils

### Code paths

Assuming you've followed all the steps in the README to install spotlight and its dependencies, it can be started by running `grunt` in a terminal.

(A better way of doing this is actually to run `nodemon app/server -e js,json,html,css` because this will restart the server when you change files, and is a lot faster than grunt. That is out of the scope of this document though.)

What this actually does once inside grunt is run `node app/server.js`.

server.js then proceeds to collect together all of the configuration it needs to know how to run the app, and then loads appBuilder.js.

appBuilder.js creates an instance of Express, sets up assorted middleware to do thing like logging and payload compression, and then binds a selection of routing information.

#### Routing

A number of routes are set up in appBuilder.js. Firstly anything ending in `.png` is passed off to screenshot as a service.

Then requests for stagecraft stubs are handled - more on that later.

Then requests for static pages i.e. homepage, services list, about, prototypes etc. are handled. These each load their own controller. Adding more non-dashboard pages means adding more routes and controllers here.

Last, but not least, any route that has not yet been caught by the previous route handlers is assumed to be a dashboard.

#### Dashboard rendering

The route handler for dashboards is in process_request.js

This first loads the corresponding config from the stagecraft stub service, then instantiates a page controller based on the "page-type" property in config.

Right now this always means loading the dashboard controller, as we don't have any other page types.

The dashboard controller then instantiates a module controller for each module in the config based on its "module-type" property. These are looked up from app/server/controller_map.js, so if you create a new module type then you will need to map it to a controller in this file.

#### Module rendering

Most modules consist of a few configuration options:

* `visualisationClass` - the view used to render the module
* `collectionClass` - the collection used to fetch/parse the data
* `visualisationOptions`/`collectionOptions` - options used to instantiate the above classes

Other things, which are hopefully self explanatory - e.g. hasTable

Visualisations on the server normally inherit from a common visualisation in `app/common/views/visualisations/` and then extend with `templatePath` and optional `templateEngine` properties.

The templateType should be either `mustache` or `underscore` depending on the engine used, and if undefined defaults to `underscore`.

### Client rendering

`app/client/client_bootstrap.js` works in a similar way to the dashboard controller on the server in that it loads a controller for each module, except it loads `app/client/controller_map.js` to create the mappings from `module-type` property to a particular module script.

This means that new modules that require client-side rendering and processing should be added to this file.

### Other things...

## Stagecraft stubs

Since stagecraft is something of a work in progress there is a stub version of stagecraft consisting of a collection of JSON files corresponding to dashboards.

These live in [app/support/stagecraft_stub/responses](https://github.com/alphagov/spotlight/tree/master/app/support/stagecraft_stub/responses).

## Config

Config settings for development environments live in [config.development.json](https://github.com/alphagov/spotlight/blob/master/config/config.development.json). However, since this in version control you may wish to overwrite settings for local development by copying this file into a file named `config.development_personal.json` in the same directory. This will be used instead, and is ignored by version control so you don't need to worry about accidentally pushing changes back to the repo.

## Tests...

Live in spec/

Run using [Jasmine (v1.3)](http://jasmine.github.io/1.3/introduction.html).

## Things that suck

* Require ALL THE SCRIPTS!! - main.js - non-dashboard pages still load all the dashboard/module scripts
* Double collection fetches
* One template system to rule them all

## The future...

The future of spotlight in the short to medium term is about reducing the scope of what spotlight actually does.
This has started with Nick's work to flatten the data-sets in backdrop and reduce the amount of data processing and normalisation that spotlight does.
It will also include the stagecraft/admin app which should remove the

### Going to happen:

* Actual stagecraft/admin app

### Should happen:

* Dynamic starting scripts - especially for non-dashboard pages
* Fetch collection once and bootstrap
* Remove all DOM manipulation from the server-side code
* Kill the backdrop stubs - they never get used

