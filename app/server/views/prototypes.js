var requirejs = require('requirejs');

var View = require('./govuk');
var template = requirejs('tpl!common/templates/prototypes.html');


module.exports = View.extend({

  getPageTitle: function () {
    return 'Performance prototypes - GOV.UK';
  },

  getBreadcrumbCrumbs: function () {
    return [];
  },

  getContent: function () {
    return template(this.model.toJSON());
  }

});

