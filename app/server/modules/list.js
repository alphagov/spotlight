var requirejs = require('requirejs');

var ModuleController = require('../controllers/module');
var View = require('../views/modules/list');

var Collection = requirejs('common/collections/list');

module.exports = ModuleController.extend({

  visualisationClass: View,
  collectionClass: Collection,

  hasTable: false,

  collectionOptions: function () {
    return {
      id: 'list',
      title: 'List',
      queryParams: this.model.get('query-params'),
      labelAttr: this.model.get('label-attr'),
      labelRegex: this.model.get('label-regex'),
      linkAttr: this.model.get('link-attr'),
      urlRoot: this.model.get('url-root')
    };
  }

});