var requirejs = require('requirejs');

var ModuleController = require('../controllers/module');
var ColumnController = requirejs('common/modules/column');

var View = require('../views/modules/column');

module.exports = ModuleController.extend(ColumnController).extend({

  visualisationClass: View

});