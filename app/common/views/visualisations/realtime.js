define([
  'extensions/views/view',
  'tpl!common/templates/visualisations/realtime.html'
],
function (View, template) {
  var VisitorsRealtimeView = View.extend({

    template: template,

    initialize: function (options) {
      View.prototype.initialize.apply(this, arguments);
      if (isClient) {
        this.listenTo(this.collection, 'sync', this.updateValue);
        this.updateValue();
      }
      this.numberOfVisitorsRealtime = 0;
    },

    updateInterval: 250,

    updateValue: function () {
      if (!this.collection.length) {
        return;
      }

      var newNumberOfVisitors = parseFloat(this.collection.at(0).get("unique_visitors"));
      if (!this.currentNumberOfVisitors) {
        if (this.collection.length == 1) {
          this.currentNumberOfVisitors = 0;
        } else {
          this.currentNumberOfVisitors = parseFloat(this.collection.at(1).get("unique_visitors"));
        }
      }

      var numberOfSteps = this.collection.updateInterval / this.updateInterval;

      var diff = (newNumberOfVisitors - this.currentNumberOfVisitors) / numberOfSteps;

      var interpolate = _.bind(function () {
        this.render();
        this.currentNumberOfVisitors += diff;

        if (numberOfSteps-- > 0) {
          this.timer = setTimeout(interpolate, this.updateInterval);
        }
      }, this);
      interpolate();
    },

    templateContext: function () {
      var numberOfVisitors = Math.round(
        this.currentNumberOfVisitors || parseFloat(this.collection.at(0).get("unique_visitors"))
      );
      return _.extend(
        View.prototype.templateContext.apply(this, arguments),
        { numberOfVisitors: numberOfVisitors }
      );
    }
  });
  return VisitorsRealtimeView;
});