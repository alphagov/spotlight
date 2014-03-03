define([
  'extensions/collections/collection'
], function(Collection) {
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

    queryParams: function() {
      var weeksAgo = this.options.weeksAgo || 0;
      return this.lastWeekDateRange(this.getMoment(), weeksAgo);
    },

    parse: function (response) {
      var data = _.map(this.axes.y, function (step) {
        return _.extend({
          title: step.label,
          step: step.journeyId,
          uniqueEvents: 0,
          uniqueEventsNormalised: 0
        }, _.find(response.data, function (responseStep) {
          return this.getStep(responseStep) === step.journeyId;
        }, this));
      }, this);

      var maxVal = _.reduce(data, function (memo, step) {
        return Math.max(memo, step.uniqueEvents);
      }, 0);

      if (maxVal !== 0) {
        _.each(data, function (step) {
          step.uniqueEventsNormalised = step.uniqueEvents / maxVal;
        });
      }

      return data;
    },

    getStep: function(d) {
      return d[this.options.matchingAttribute] || d.eventCategory;
    }
  });

  return JourneySeriesCollection;
});
