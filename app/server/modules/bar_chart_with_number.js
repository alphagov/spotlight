var requirejs = require('requirejs');

var ModuleController = require('../controllers/module');
var BarChartController = requirejs('common/modules/bar_chart_with_number');

var View = require('../views/modules/bar_chart_with_number');

module.exports = ModuleController.extend(BarChartController).extend({

  visualisationClass: View

});