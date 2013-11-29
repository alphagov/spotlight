var requirejs = require('requirejs');
var app_config = requirejs('./config');
app_config.baseUrl = 'app/';
app_config.nodeRequire = require;
requirejs.config(app_config);

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
    environment = process.env.NODE_ENV || argv.env || 'development';

global._ = require('underscore');
global.config = requirejs('environment_config').configure(environment, argv);

if (environment === 'cucumber') {
  environment = 'development';
}

var app = express();
app.disable('x-powered-by');

app.configure(function () {
  app.set('environment', environment);
  app.set('requirePath', argv.REQUIRE_BASE_URL || '/app/');
  app.set('assetPath', global.config.assetPath);
  app.set('backdropUrl', global.config.backdropUrl);
  app.set('clientRequiresCors', global.config.clientRequiresCors);
  app.set('port', global.config.port);
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.compress());
  app.use('/assets', express.static(path.join(rootDir, 'public')));
  app.use('/assets/images', express.static(path.join(rootDir, 'public')));
});

app.configure('development', function () {
  app.use(express.errorHandler());
  app.use('/app', express.static(path.join(rootDir, 'app')));
  app.get('/backdrop-stub/:service/:api_name', requirejs('./support/backdrop_stub/backdrop_stub_controller'));
  app.use('/.grunt', express.static(path.join(rootDir, '.grunt')));
  app.use('/test/spec', express.static(path.join(rootDir, 'test', 'spec')));
  app.use('/spec', function (req, res) {
    res.sendfile(path.join(rootDir, '_SpecRunner.html'));
  });
});

app.get('*.png', requirejs('./render_png'));

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
