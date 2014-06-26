define([
  'extensions/collections/collection'
], function (Collection) {
  var JourneySeriesCollection = Collection.extend({

    initialize: function (models, options) {
      options = options || {};
      if (options.getStep) {
        this.getStep = options.getStep;
      }
      if (options.axes) {
        this.axes = options.axes;
      }
      Collection.prototype.initialize.apply(this, arguments);
    },

    queryParams: function () {
      var weeksAgo = this.options.weeksAgo || 0;
      return _.extend(this.lastWeekDateRange(this.getMoment(), weeksAgo), {
        filter_by: this.options.filterBy ? this.options.filterBy : []
      });
    },

    parse: function () {
      var data = Collection.prototype.parse.apply(this, arguments);
      data = _.map(this.axes.y, function (step) {
        var matchingModel = _.find(data, function (responseStep) {
          return this.getStep(responseStep) === step.journeyId;
        }, this);
        return _.extend({
          title: step.label,
          step: step.journeyId
        }, matchingModel);
      }, this);

      if (this.hasData()) {
        _.each(data, function (m) {
          m[this.valueAttr] = m[this.valueAttr] || 0;
        }, this);
      }
      return data;
    },

    hasData: function () {
      return this.defined(this.valueAttr).length > 0;
    },

    getStep: function (d) {
      return d[this.options.matchingAttribute];
    },

    getTableRows: function (keys) {
      return [this.map(function (model, i) {
        return model.get(keys[i]);
      })];
    }

  });

  return JourneySeriesCollection;
});
