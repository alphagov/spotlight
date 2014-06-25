var requirejs = require('requirejs');

var ModuleController = require('../controllers/module');

var View = require('../views/modules/user_satisfaction');

var Collection = requirejs('extensions/collections/collection');

module.exports = ModuleController.extend({

  visualisationClass: View,
  collectionClass: Collection,

  hasTable: false,
  collectionOptions: function () {
    return {
      id: 'user_satisfaction',
      title: 'User satisfaction',
      sortBy: '_timestamp:ascending',
      limit: 0,
      valueAttr: this.model.get('value-attribute')
    };
  }
});