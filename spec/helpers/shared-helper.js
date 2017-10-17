var obj;
var logger = {
  info: function () {},
  debug: function () {},
  error: function () {},
  log: function () {},
  warn: function () {}
};
if (typeof window === 'object') {
  window.isClient = false;
  window.isServer = false;
  obj = window;
}
if (typeof global === 'object') {
  global.isClient = false;
  global.isServer = false;
  obj = global;

  global._ = require('lodash');
  global.jQuery = global.$ = require('jquery')(require('jsdom').jsdom().defaultView);
}

obj.logger = logger;

jasmine.clientOnly = function (method) {
  obj.isClient = true;
  obj.isServer = false;
  method();
  obj.isClient = false;
};

jasmine.serverOnly = function (method) {
  obj.isServer = true;
  obj.isClient = false;
  method();
  obj.isServer = false;
};
