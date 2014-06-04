var requirejs = require('requirejs');

var ModuleController = require('../controllers/module');
var JourneyController = requirejs('common/modules/journey');

module.exports = ModuleController.extend(JourneyController);