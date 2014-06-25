define([
  'extensions/collections/collection'
],
function (Collection) {
  var AvailabilityCollection = Collection.extend({

    queryParams: function () {
      var params = {
        period: this.options.period || 'day',
        collect: ['downtime:sum', 'uptime:sum', 'unmonitored:sum', 'avgresponse:mean']
      };
      params.end_at = this.options.endAt || null;
      return params;
    },

    parse: function () {
      var data = Collection.prototype.parse.apply(this, arguments);
      _.each(data, function (d) {
        if (d.downtime === null && d.uptime === null) {
          d.total = null;
          d.uptimeFraction = null;
        } else {
          d.total = d.downtime + d.uptime;
          d.uptimeFraction = d.uptime / d.total;
        }
      }, this);
      return data;
    },

    _getTotalUptime: function () {
      return this.total('uptime');
    },

    _getTotalTime: function (includeUnmonitored) {
      var total = this.total('total');
      if (includeUnmonitored) {
        total += this.total('unmonitored');
      }
      return total;
    },

    getFractionOfUptime: function () {
      return this._getTotalUptime() / this._getTotalTime();
    },

    getAverageResponseTime: function () {
      return this.mean('avgresponse');
    }

  });

  return AvailabilityCollection;
});
