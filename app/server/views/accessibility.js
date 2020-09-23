var path = require('path');

var templater = require('../mixins/templater');

var BaseView = require('./govuk');

module.exports = BaseView.extend(templater).extend({

  getPageTitle: function () {
    return 'Performance Platform Accessibility Statement - GOV.UK';
  },

  getContent: function () {
    return this.loadTemplate(path.resolve(__dirname, '../templates/accessibility.html'), this.model.toJSON());
  }

});
