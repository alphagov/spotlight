var path = require('path');

var View = require('./govuk');
var templatePath = path.resolve(__dirname, '../templates/prototypes.html');

module.exports = View.extend({

  getPageTitle: function () {
    return 'Performance prototypes - GOV.UK';
  },

  getContent: function () {
    return this.loadTemplate(templatePath, this.model.toJSON());
  }

});

