var requirejs = require('requirejs');

var ModuleController = require('../controllers/module');
var GroupedTimeseriesController = requirejs('common/modules/grouped_timeseries');

var View = require('../views/modules/grouped_timeseries');

module.exports = ModuleController.extend(GroupedTimeseriesController).extend({

  visualisationClass: View

});
