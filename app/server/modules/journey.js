var requirejs = require('requirejs');

var ModuleController = require('../controllers/module');
var JourneyController = requirejs('common/modules/journey');

module.exports = ModuleController.extend(JourneyController).extend({

  visualisationOptions: function () {
    return _.extend(ModuleController.prototype.visualisationOptions.call(this),
      JourneyController.visualisationOptions.call(this));
  }

});