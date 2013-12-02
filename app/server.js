var requirejs = require('requirejs');

//Config for libraries accessible and require js
var app_config = requirejs('./config');
app_config.baseUrl = 'app/';
app_config.nodeRequire = require;
requirejs.config(app_config);

//Command line args
var argv = require('optimist').argv;
var environment = process.env.NODE_ENV || argv.env || 'development';

//GLOBALS:

//- setting server $ stuff
var backbone = require('backbone');
    XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var $ = global.$ = backbone.$ = global.jQuery = require('jquery');
$.support.cors = true;

$.ajaxSettings.xhr = function () {
    return new XMLHttpRequest();
};

//- the rest
global.isServer = true;
global.isClient = false;

global._ = require('underscore');
global.config = requirejs('environment_config').configure(environment, argv);

//App stuff

if(environment.match(/^development/)){
  environment = 'development';
}

var http = require('http'),
    path = require('path');

var rootDir = path.join(__dirname, '..');
var app = requirejs('appBuilder').getApp(environment, rootDir, argv.REQUIRE_BASE_URL);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

exports = module.exports = server;

exports.use = function () {
	app.use.apply(app, arguments);
};
