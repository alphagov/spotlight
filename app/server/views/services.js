var requirejs = require('requirejs');
var path = require('path');

var BaseView = require('./govuk');
var TableView = requirejs('extensions/views/table');

var contentTemplate = path.resolve(__dirname, '../templates/services.html');

module.exports = BaseView.extend({

  heading: 'Services data',
  example: 'Driving licences',

  initialize: function () {
    this.contentTemplate = contentTemplate;
    this.filterCollection = new this.collection.constructor(this.collection.models, this.collection.options);
    this.updateCollectionFilter();
  },

  updateCollectionFilter: function () {
    var filteredList = this.collection.filterServices({
      text: this.model.get('filter'),
      department: this.model.get('departmentFilter'),
      service: this.model.get('serviceFilter')
    });

    this.filterCollection.reset(filteredList);
  },

  getPageTitle: function () {
    return 'Services data - GOV.UK';
  },

  getBreadcrumbCrumbs: function () {
    return [
      {'path': '/performance', 'title': 'Performance'},
      {'title': this.heading}
    ];
  },

  formatAggregateValues: function () {
    var aggVals;
    if (!this.filterCollection.getAggregateValues) {
      return;
    }

    aggVals = this.filterCollection.getAggregateValues();

    _.each(aggVals, function (kpi) {
      if (kpi.weighted_average) {
        kpi.formattedValue = this.format(kpi.weighted_average, kpi.format);
      }
    }, this);

    return _.map(this.collection.options.axes.y, function (kpiAxes) {
      var kpiName = kpiAxes.key;
      return _.findWhere(aggVals, {key: kpiName}) || kpiAxes;
    });
  },

  getContent: function () {
    var table = new TableView({
      model: this.model,
      collection: this.filterCollection,
      collapseOnNarrowViewport: true,
      caption: 'List of services, which can be filtered and sorted',
      id: 'services-list'
    });

    table.render();

    return this.loadTemplate(this.contentTemplate, _.extend({
      table: table.$el.html(),
      filter: this.model.get('filter'),
      departments: this.model.get('departments'),
      departmentFilter: this.model.get('departmentFilter'),
      services: this.model.get('services'),
      serviceFilter: this.model.get('serviceFilter'),
      agencies: this.model.get('agencies'),
      filteredCount: this.filterCollection.length,
      aggregateVals: this.formatAggregateValues()
    }, {
      heading: this.heading,
      example: this.example,
      noun: this.model.get('noun')
    }));

  }

});
