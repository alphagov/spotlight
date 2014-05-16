var requirejs = require('requirejs');

//Config for libraries accessible and require js
var appConfig = requirejs('./config');
appConfig.baseUrl = 'app/';
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

var port = process.env.PORT || app.get('port');

var server = http.createServer(app).listen(port, function () {
  global.logger.info('Express server listening on port ' + port);
});

exports = module.exports = server;

exports.use = function () {
  app.use.apply(app, arguments);
};
