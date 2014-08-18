define([
  'common/views/visualisations/availability',
  'client/views/visualisations/percentage-graph',
  'client/views/visualisations/single-stat-graph'
],
function (View, UptimeGraph, ResponseTimeGraph) {
  return View.extend({

    views: function () {
      var views = View.prototype.views.apply(this, arguments);
      return _.extend(views, {
        '.uptime-graph': {
          view: UptimeGraph,
          options: {
            valueAttr: 'uptimeFraction'
          }
        },
        '.response-time-graph': {
          view: ResponseTimeGraph,
          options: {
            valueAttr: 'avgresponse:mean',
            formatOptions: {
              type: 'duration',
              unit: 's',
              pad: false
            }
          }
        }
      });
    }

  });

});
