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
          step: step.journeyId
        }, _.find(response.data, function (responseStep) {
          return this.getStep(responseStep) === step.journeyId;
        }, this));
      }, this);

      return data;
    },

    getStep: function(d) {
      return d[this.options.matchingAttribute] || d.eventCategory;
    }
  });

  return JourneySeriesCollection;
});
