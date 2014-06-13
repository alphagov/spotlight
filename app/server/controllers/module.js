var requirejs = require('requirejs');

var ModuleController = requirejs('extensions/controllers/module');

var ModuleView = require('../views/module');
var Visualisation = require('../views/visualisation');

module.exports = ModuleController.extend({

  viewClass: ModuleView,
  visualisationClass: Visualisation,
  visualisationOptions: function () {
    return {
      fallbackUrl: this.requiresSvg && this.url ? (this.url + '.png') : null
    };
  },
  requiresSvg: false

});