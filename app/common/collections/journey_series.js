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

      this.valueAttr = options.valueAttr || 'uniqueEvents';
      this.dateRange = this.lastWeekDateRange(
          this.getMoment(), options.weeksAgo || 0);

      Collection.prototype.initialize.apply(this, arguments);
    },

    queryParams: function () {
      return this.dateRange;
    },

    parse: function () {
      var data = Collection.prototype.parse.apply(this, arguments);
      data = _.map(this.axes.y, function (step) {
        var matchingModel = _.find(data, function (responseStep) {
          return this.getStep(responseStep) === step.groupId;
        }, this);
        if (matchingModel) {
          matchingModel[step.groupId + ':' + this.valueAttr] = matchingModel[this.valueAttr];
        }
        return _.extend({
          title: step.label,
          step: step.groupId
        }, matchingModel);
      }, this);

      if (this.hasData(data)) {
        _.each(data, function (m) {
          m[this.valueAttr] = m[this.valueAttr] || 0;
        }, this);
      }
      return data;
    },

    hasData: function (data) {
      return _.any(data, function (m) {
        return m[this.valueAttr] !== null && m[this.valueAttr] !== undefined;
      }, this);
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
