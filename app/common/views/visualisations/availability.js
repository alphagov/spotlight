define([
  'extensions/views/view',
  'common/views/visualisations/availability/uptime-number',
  'common/views/visualisations/availability/response-time-number'
],
function (View, UptimeNumber, ResponseTimeNumber) {
  return View.extend({

    views: function () {
      return {
        '.uptime': {view: UptimeNumber},
        '.response-time': {view: ResponseTimeNumber}
      };
    }

  });

});
