var requirejs = require('requirejs');

var ModuleController = require('../controllers/module');
var TableController = requirejs('common/modules/table');
var TableView = requirejs('extensions/views/table');

var Collection = requirejs('common/collections/list');

module.exports = ModuleController.extend(TableController).extend({

  visualisationClass: TableView,
  collectionClass: Collection,

  collectionOptions: function () {
    return {
      id: 'list',
      title: 'List',
      queryParams: this.model.get('query-params'),
      axes: this.model.get('axes')
    };
  },

  viewOptions: function () {
    var options = ModuleController.prototype.viewOptions.apply(this, arguments);
    options.url = null;
    return options;
  }

});
