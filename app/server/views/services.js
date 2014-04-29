var requirejs = require('requirejs');

var BaseView = requirejs('common/views/govuk');
var ListView = requirejs('common/views/filtered_list');
var template = requirejs('tpl!server/templates/services.html');

module.exports = BaseView.extend({

  getPageTitle: function () {
    return 'Services - GOV.UK';
  },

  getBreadcrumbCrumbs: function () {
    return [
      {'path': '/performance', 'title': 'Performance'},
      {'title': 'Services'}
    ];
  },

  getContent: function () {

    var list = new ListView({
      model: this.model,
      collection: this.collection
    });

    list.render();

    return template({
      list: list.html
    });

  }

});