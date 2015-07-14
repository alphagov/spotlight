var path = require('path');
var requirejs = require('requirejs');
var templatePath = path.resolve(__dirname, '../templates/homepage.html');

var Backbone = require('backbone');
var BaseView = require('./govuk');
var TableView = requirejs('extensions/views/table');

module.exports = BaseView.extend({

  getPageTitle: function () {
    return 'Performance - GOV.UK';
  },

  getBodyClasses: function () {
    return 'homepage';
  },

  formatKpis: function (services) {
    _.each(services, function (service) {
      _.each(this.collection.options.axes.y, function (kpi) {
        if (service[kpi.key] === null) {
          service[kpi.key] = '?';
        }
        service[kpi.key] = this.format(service[kpi.key], kpi.format);
      }, this);
    }, this);
  },

  renderServicesTable: function(sortField, sortOrder) {
    var table,
      optionsCopy,
      caption;

    optionsCopy = _.cloneDeep(this.collection.options);

    optionsCopy.axes = {
      x: optionsCopy.axes.x,
      y: _.where(optionsCopy.axes.y, function(kpi) {
        return (kpi.key === sortField);
      })
    };
    caption = optionsCopy.axes.y[0].label;

    table = new TableView({
      model: new Backbone.Model({
        params: {
          sortby:  sortField,
          sortorder:  sortOrder || 'descending'
        }
      }),
      collection: new this.collection.constructor(this.collection.toJSON(), optionsCopy),
      caption: 'The 5 top performing services, by ' + caption,
      rowLimit: 5,
      hideHeader: true
    });
    table.render();
    return table.$el.html();
  },

  getContent: function () {
    this.formatKpis(this.showcaseServices);
    return this.loadTemplate(templatePath, _.extend({
      services: this.collection,
      serviceCount: this.collection.length,
      webTrafficCount: this.contentDashboards.length,
      otherCount: this.otherDashboards.length,
      showcaseServices: this.showcaseServices,
      tableCost: this.renderServicesTable('cost_per_transaction', 'ascending'),
      tableSatisfaction: this.renderServicesTable('user_satisfaction_score'),
      tableCompletion: this.renderServicesTable('completion_rate'),
      tableDigital: this.renderServicesTable('digital_takeup')
    }, this.model.toJSON()));

  }

});
