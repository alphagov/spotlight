var requirejs = require('requirejs');
var path = require('path');

require('backbone').$ = require('jquery');

requirejs.config({
  baseUrl: path.join(process.cwd(), 'app')
});

requirejs.config(requirejs('config'));

global.isServer = true;
global.config = {};
global._ = require('lodash');
global.$ = require('jquery');
global.isClient = false;
global.logger = {
  info: function () {},
  debug: function () {},
  error: function () {},
  log: function () {},
  warn: function () {}
};