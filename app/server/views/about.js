var path = require('path');

var templater = require('../mixins/templater');

var BaseView = require('./govuk');

module.exports = BaseView.extend(templater).extend({

  getPageTitle: function () {
    return 'About Performance - GOV.UK';
  },

  getContent: function () {
    return this.loadTemplate(path.resolve(__dirname, '../templates/about.html'), this.model.toJSON());
  }

});
