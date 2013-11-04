var requirejs = require('requirejs');
var config = requirejs('./config');
config.baseUrl = 'app/';
config.nodeRequire = require;
requirejs.config(config);

var argv = require('optimist').argv;

var express = require('express'),
    http = require('http'),
    path = require('path');

global.isServer = true;
global.isClient = false;

var backbone = require('backbone');
var $ = global.$ = backbone.$ = global.jQuery = require('jquery');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
$.support.cors = true;
$.ajaxSettings.xhr = function () {
    return new XMLHttpRequest();
};


var rootDir = path.join(__dirname, '..'),
    environment = process.env.NODE_ENV || 'development';

global._ = require('underscore');
global.config = require(path.join(rootDir, 'config', 'config.' + environment + '.json'));

var app = express();

app.configure(function () {
  app.set('environment', environment);
  app.set('requirePath', argv.REQUIRE_BASE_URL || '/app/');
  app.set('assetPath', global.config.assetPath);
  app.set('port', argv.p || global.config.port);
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.compress());
  app.use('/assets', express.static(path.join(rootDir, 'public')));
  app.use('/assets/images', express.static(path.join(rootDir, 'public')));
});

app.configure('development', function () {
  app.use('/app', express.static(path.join(rootDir, 'app')));
  app.use('/.grunt', express.static(path.join(rootDir, '.grunt')));
  app.use('/test/spec', express.static(path.join(rootDir, 'test', 'spec')));
  app.use('/spec', function (req, res) {
    res.sendfile(path.join(rootDir, '_SpecRunner.html'));
  });
  app.use(express.errorHandler());

  app.get('/backdrop-stub/:service/api/:api_name', requirejs('./support/backdrop_stub/backdrop_stub_controller'));
});

app.get('/stagecraft-stub/*', requirejs('./support/stagecraft_stub/stagecraft_stub_controller'));

app.use('/performance/', requirejs('process_request'));

app.get('/_status', requirejs('healthcheck_controller'));

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


exports = module.exports = server;

exports.use = function () {
	app.use.apply(app, arguments);
};
