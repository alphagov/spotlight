define([
  'extensions/views/view',
  'tpl!common/templates/visualisations/visitors-realtime.html'
],
function (View, template) {
  var VisitorsRealtimeView = View.extend({

    template: template,

    initialize: function (options) {
      View.prototype.initialize.apply(this, arguments);

      if (isClient) {
        this.listenTo(this.collection, 'sync', this.updateValue);
      }

      this.currentVisitors = this.getCurrentVisitors();
    },

    getCurrentVisitors: function () {
      if (this.collection && this.collection.length) {
        return parseFloat(this.collection.at(0).get("unique_visitors"));
      } else {
        return null;
      }
    },

    updateInterval: 500,

    updateValue: function () {
      var newNumberOfVisitors = this.getCurrentVisitors();

      if (newNumberOfVisitors === this.currentVisitors) {
        // value unchanged, don't interpolate
        return;
      }

      var numberOfSteps = this.collection.updateInterval / this.updateInterval;
      var diff = (newNumberOfVisitors - this.currentVisitors) / numberOfSteps;

      var interpolate = _.bind(function () {
        this.render();

        if (numberOfSteps-- > 0) {
          this.currentVisitors += diff;
          this.timer = setTimeout(interpolate, this.updateInterval);
        } else {
          // manually set to final value to avoid accumulation of rounding
          // errors over time
          this.currentVisitors = newNumberOfVisitors; 
        }
      }, this);
      interpolate();
    },

    templateContext: function () {
      var numberOfVisitors = null;
      if (this.currentVisitors != null) {
        numberOfVisitors = Math.round(this.currentVisitors);
      }
      return _.extend(
        View.prototype.templateContext.apply(this, arguments),
        { numberOfVisitors: numberOfVisitors }
      );
    }
  });
  return VisitorsRealtimeView;
});