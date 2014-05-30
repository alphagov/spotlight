define([
  './bar-chart'
],
function (BarChart) {
  var UserSatisfaction = BarChart.extend({
    initialize: function () {
      this.listenTo(this.collection.at(0).get('values'), 'reset', this.render, this);

      BarChart.prototype.initialize.apply(this, arguments);
    },

    components: function () {
      var components = BarChart.prototype.components.apply(this, arguments);

      delete components.hover;

      components.xaxis.view = components.xaxis.view.extend({
        useEllipses: false
      });

      return components;
    }

  });
  return UserSatisfaction;
});
