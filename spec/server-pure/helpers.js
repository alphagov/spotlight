var requirejs = require('requirejs');
var path = require('path');

require('backbone').$ = require('jquery');

requirejs.config({
  baseUrl: path.join(process.cwd(), 'app')
});

requirejs.config(requirejs('config'));

global.isServer = true;
global.config = {};