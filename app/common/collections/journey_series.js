define([
  'extensions/collections/collection'
], function (Collection) {
  var JourneySeriesCollection = Collection.extend({

    valueAttr: 'uniqueEvents',

    initialize: function (models, options) {
      options = options || {};
      if (options.getStep) {
        this.getStep = options.getStep;
      }
      if (options.axes) {
        this.axes = options.axes;
      }
      if (options.valueAttr) {
        this.valueAttr = options.valueAttr;
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
          return this.getStep(responseStep) === step.categoryId;
        }, this);
        if (matchingModel) {
          matchingModel[step.categoryId + ':' + this.valueAttr] = matchingModel[this.valueAttr];
        }
        return _.extend({
          title: step.label,
          step: step.categoryId
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
