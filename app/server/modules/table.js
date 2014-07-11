var requirejs = require('requirejs');

var ModuleController = require('../controllers/module');
var TableView = requirejs('extensions/views/table');

var Collection = requirejs('extensions/collections/collection');

module.exports = ModuleController.extend({

  requiresSvg: false,
  hasTable: false,

  visualisationClass: TableView,
  collectionClass: Collection,

  visualisationOptions: function () {
    return {
      sortBy: this.model.get('sort-by'),
      sortOrder: this.model.get('sort-order') || 'descending',
      url: this.url
    };
  },

  collectionOptions: function () {
    return {
      id: 'list',
      title: 'List',
      axes: this.model.get('axes')
    };
  }

});
