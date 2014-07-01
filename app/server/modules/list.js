var requirejs = require('requirejs');

var ModuleController = require('../controllers/module');
var View = require('../views/modules/list');

var Collection = requirejs('extensions/collections/collection');

module.exports = ModuleController.extend({

  visualisationClass: View,
  collectionClass: Collection,

  hasTable: false,

  collectionOptions: function () {
    return {
      id: 'list',
      title: 'List',
      labelAttr: this.model.get('label-attr'),
      labelRegex: this.model.get('label-regex'),
      linkAttr: this.model.get('link-attr'),
      urlRoot: this.model.get('url-root')
    };
  }

});
