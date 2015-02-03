var requirejs = require('requirejs');
var path = require('path');

var BaseView = require('./govuk');
var TableView = requirejs('extensions/views/table');

var contentTemplate = path.resolve(__dirname, '../templates/services.html');

module.exports = BaseView.extend({

  heading: 'Service dashboards',
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

  getAggregateValues: function () {
    var aggVals = this.filterCollection.getAggregateValues();

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
      caption: 'Table showing a list of transactions, which can be filtered and sorted',
      id: 'services-list'
    });

    table.render();

    return this.loadTemplate(contentTemplate, _.extend({
      table: table.$el.html(),
      filter: this.model.get('filter'),
      departments: this.model.get('departments'),
      departmentFilter: this.model.get('departmentFilter'),
      agencies: this.model.get('agencies'),
      filteredCount: this.filterCollection.length,
      aggregateVals: this.getAggregateValues()
    }, {
      heading: this.heading,
      example: this.example,
      noun: this.model.get('noun')
    }));

  }

});
