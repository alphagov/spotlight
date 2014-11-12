var requirejs = require('requirejs');

var ModuleController = require('../controllers/module');
var View = require('../views/modules/kpi');

var Collection = requirejs('extensions/collections/collection');

module.exports = ModuleController.extend({

  visualisationClass: View,
  collectionClass: Collection,

  hasTable: false

});
