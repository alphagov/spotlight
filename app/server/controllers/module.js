var requirejs = require('requirejs');

var ModuleController = requirejs('extensions/controllers/module');

var ModuleView = require('../views/module');

module.exports = ModuleController.extend({

  viewClass: ModuleView,
  requireSvg: false

});