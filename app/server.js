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
global.requirePath = argv.REQUIRE_BASE_URL || '/app/';
global.assetPath = '/assets/';


var $ = global.$ = global.jQuery = require('jquery');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
$.support.cors = true;
$.ajaxSettings.xhr = function () {
    return new XMLHttpRequest();
};

var rootDir = path.join(__dirname, '..');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.compress());
  app.use('/assets', express.static(path.join(rootDir, 'public')));
  app.use('/assets/images', express.static(path.join(rootDir, 'public')));
});

app.configure('development', function(){

  app.use('/app', express.static(path.join(rootDir, 'app')));
  app.use('/.grunt', express.static(path.join(rootDir, '.grunt')));
  app.use('/test/spec', express.static(path.join(rootDir, 'test', 'spec')));
  app.use('/spec', function (req, res) {
    res.sendfile(path.join(rootDir, '_SpecRunner.html'));
  });
  app.use(express.errorHandler());
});


var render = requirejs('./render');
app.use('/performance', render);


var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


exports = module.exports = server;

exports.use = function() {
	app.use.apply(app, arguments);
};
