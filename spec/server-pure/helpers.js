var requirejs = require('requirejs');
var path = require('path');

var jquery = require('jquery')(require('jsdom').jsdom().defaultView);

require('backbone').$ = jquery;

requirejs.config({
  baseUrl: path.join(process.cwd(), 'app')
});

requirejs.config(requirejs('config'));

global.isServer = true;
global.config = {};
global._ = require('lodash');
global.$ = jquery;
global.isClient = false;
global.logger = {
  info: function () {},
  debug: function () {},
  error: function () {},
  log: function () {},
  warn: function () {}
};
