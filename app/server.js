var requirejs = require('requirejs');

//Config for libraries accessible and require js
requirejs.config({baseUrl: __dirname + '/'});

var appConfig = requirejs('./config');

appConfig.nodeRequire = require;
requirejs.config(appConfig);

//Command line args
var argv = require('optimist').argv;
var environment = process.env.NODE_ENV || argv.env || 'development';

//GLOBALS:

//- setting server $ stuff
var backbone = require('backbone'),
    XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

global.$ = backbone.$ = global.jQuery = require('jquery');

$.support.cors = true;

$.ajaxSettings.xhr = function () {
  return new XMLHttpRequest();
};

//- the rest
global.isServer = true;
global.isClient = false;

global._ = require('lodash');
global.config = requirejs('environment_config').configure(environment, argv);
global.logger = requirejs('logger');

//App stuff

if (environment.match(/^development/)) {
  environment = 'development';
}

var http = require('http'),
    path = require('path');

var rootDir = path.join(__dirname, '..');
var app = require('./appBuilder').getApp(environment, rootDir, argv.REQUIRE_BASE_URL);

// Set a port for the app. There are several different ways to do this:
// - In production-like environments we fall back to the config/ directory.
// - On PaaS products like Heroku, we use the $PORT environment variable that they set.
// - When running a Procfile locally (like with Foreman) we need to override $PORT
//   by setting $SPOTLIGHT_PORT, so that our local Nginx connects to the right place.
var port = process.env.SPOTLIGHT_PORT || process.env.PORT || app.get('port');

app.set('port', port);

var server = http.createServer(app).listen(port, function () {
  global.logger.info('Express server listening on port ' + port);
});

exports = module.exports = server;

exports.use = function () {
  app.use.apply(app, arguments);
};
