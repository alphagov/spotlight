var requirejs = require('requirejs');

var ModuleController = require('../controllers/module');
var CompletionRateController = requirejs('common/modules/completion_rate');

var CompletionRateView = require('../views/modules/completion_rate');

module.exports = ModuleController.extend(CompletionRateController).extend({

  visualisationClass: CompletionRateView

});
