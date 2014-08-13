var requirejs = require('requirejs');
var path = require('path');

var BaseView = require('./govuk');
var FilteredListView = requirejs('common/views/filtered_list');

var contentTemplate = path.resolve(__dirname, '../templates/services.html');

module.exports = BaseView.extend({

  heading: 'Services',
  tagline: 'Services providing performance data to GOV.UK',
  example: 'Licensing',

  getPageTitle: function () {
    return 'Services - GOV.UK';
  },

  getBreadcrumbCrumbs: function () {
    return [
      {'path': '/performance', 'title': 'Performance'},
      {'title': this.heading}
    ];
  },

  getContent: function () {

    var list = new FilteredListView({
      model: this.model,
      collection: this.collection
    });

    list.render();

    return this.loadTemplate(contentTemplate, _.extend({
      list: list.html,
      filter: this.model.get('filter'),
      departments: this.model.get('departments'),
      departmentFilter: this.model.get('departmentFilter'),
      agencies: this.model.get('agencies'),
      agencyFilter: this.model.get('agencyFilter')
    }, {
      heading: this.heading,
      tagline: this.tagline,
      example: this.example,
      noun: this.model.get('noun')
    }));

  }

});
