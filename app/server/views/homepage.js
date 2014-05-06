var requirejs = require('requirejs');
var path = require('path');

var templater = require('../mixins/templater');

var BaseView = requirejs('common/views/govuk');

module.exports = BaseView.extend(templater).extend({

  getPageTitle: function () {
    return 'Our performance - GOV.UK';
  },

  getBreadcrumbCrumbs: function () {
    return [];
  },

  getContent: function () {

    return this.loadTemplate(path.resolve(__dirname, '../templates/homepage.html'), _.extend({}, {
      collection: this.collection
    }, this.model.toJSON()));

  }

});