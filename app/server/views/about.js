var requirejs = require('requirejs');
var path = require('path');

var templater = require('../mixins/templater');

var BaseView = requirejs('common/views/govuk');

module.exports = BaseView.extend(templater).extend({

  getPageTitle: function () {
    return 'About Performance - GOV.UK';
  },

  getBreadcrumbCrumbs: function () {
    return [
      {'path': '/performance', 'title': 'Performance'},
      {'title': 'About'}
    ];
  },

  getContent: function () {
    return this.loadTemplate(path.resolve(__dirname, '../templates/about.html'), _.extend({}, {
    }, this.model.toJSON()));
  }

});
