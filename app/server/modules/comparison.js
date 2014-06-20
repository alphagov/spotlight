var requirejs = require('requirejs');

var ModuleController = require('../controllers/module');
var ComparisonController = requirejs('common/modules/comparison');

var View = require('../views/modules/grouped_timeseries');

module.exports = ModuleController.extend(ComparisonController).extend({

  visualisationClass: View

});