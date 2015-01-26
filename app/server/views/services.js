var requirejs = require('requirejs');
var path = require('path');

var BaseView = require('./govuk');
var TableView = requirejs('extensions/views/table');

var contentTemplate = path.resolve(__dirname, '../templates/services.html');

module.exports = BaseView.extend({

  heading: 'Find a dashboard',
  example: 'Licensing',

  initialize: function () {
    this.filterCollection = new this.collection.constructor(this.collection.models, this.collection.options);
    this.updateCollectionFilter();
  },

  updateCollectionFilter: function () {
    var filteredList = this.collection.filterServices({
      text: this.model.get('filter'),
      department: this.model.get('departmentFilter')
    });

    this.filterCollection.reset(filteredList);
  },

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

    var table = new TableView({
      model: this.model,
      collection: this.filterCollection
    });

    table.render();

    return this.loadTemplate(contentTemplate, _.extend({
      table: table.$el.html(),
      filter: this.model.get('filter'),
      departments: this.model.get('departments'),
      departmentFilter: this.model.get('departmentFilter'),
      agencies: this.model.get('agencies'),
      filteredCount: this.filterCollection.length
    }, {
      heading: this.heading,
      example: this.example,
      noun: this.model.get('noun')
    }));

  }

});
