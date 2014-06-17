var path = require('path');

var templater = require('../mixins/templater');

var BaseView = require('./govuk');

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
    return this.loadTemplate(path.resolve(__dirname, '../templates/about.html'), this.model.toJSON());
  }

});
