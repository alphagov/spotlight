var requirejs = require('requirejs');

var ModuleController = require('../controllers/module');
var RealtimeController = requirejs('common/modules/visitors-realtime');
var RealtimeView = require('../views/modules/visitors-realtime');

module.exports = ModuleController.extend(RealtimeController).extend({

  visualisationClass: RealtimeView

});
