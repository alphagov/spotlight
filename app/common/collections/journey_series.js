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
      var valueAttr = this.valueAttr || 'uniqueEvents';
      data = _.map(this.axes.y, function (step) {
        var matchingModel = _.find(data, function (responseStep) {
          return this.getStep(responseStep) === step.journeyId;
        }, this);
        return _.extend({
          title: step.label,
          step: step.journeyId
        }, matchingModel);
      }, this);

      var hasData = _.any(data, function (m) {
        return m[valueAttr] !== null;
      });
      if (hasData) {
        _.each(data, function (m) {
          m[valueAttr] = m[valueAttr] || 0;
        });
      }
      return data;
    },

    getStep: function (d) {
      return d[this.options.matchingAttribute] || d.eventCategory;
    },

    getTableRows: function (keys) {
      return [this.map(function (model, i) {
        return model.get(keys[i]);
      })];
    }

  });

  return JourneySeriesCollection;
});
