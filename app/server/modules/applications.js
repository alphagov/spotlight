var requirejs = require('requirejs');

var ModuleController = require('../controllers/module');
var ColumnController = requirejs('common/modules/applications');

var View = require('../views/modules/applications');

module.exports = ModuleController.extend(ColumnController).extend({

  visualisationClass: View

});