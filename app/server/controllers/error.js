var requirejs = require('requirejs');

var Controller = requirejs('extensions/controllers/controller');
var ErrorView = require('../views/error');

module.exports = Controller.extend({
  viewClass: ErrorView
});
