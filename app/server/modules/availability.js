var requirejs = require('requirejs');

var ModuleController = require('../controllers/module');
var AvailabilityController = requirejs('common/modules/availability');

module.exports = ModuleController.extend(AvailabilityController);
