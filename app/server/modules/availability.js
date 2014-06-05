var requirejs = require('requirejs');

var ModuleController = require('../controllers/module');
var AvailabilityController = requirejs('common/modules/availability');

var AvailabilityView = require('../views/modules/availability');

module.exports = ModuleController.extend(AvailabilityController).extend({

  visualisationClass: AvailabilityView

});
