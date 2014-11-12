define([
  'extensions/collections/collection'
],
function (Collection) {
  var AvailabilityCollection = Collection.extend({

    queryParams: {
      collect: ['downtime:sum', 'uptime:sum', 'unmonitored:sum', 'avgresponse:mean']
    },

    parse: function () {
      var data = Collection.prototype.parse.apply(this, arguments);
      _.each(data, function (d) {
        if (d['downtime:sum'] === null && d['uptime:sum'] === null) {
          d.total = null;
          d.uptimeFraction = null;
        } else {
          d.total = d['downtime:sum'] + d['uptime:sum'];
          d.uptimeFraction = d['uptime:sum'] / d.total;
        }
      }, this);
      return data;
    },

    _getTotalUptime: function () {
      return this.total('uptime:sum');
    },

    _getTotalTime: function (includeUnmonitored) {
      var total = this.total('total');
      if (includeUnmonitored) {
        total += this.total('unmonitored:sum');
      }
      return total;
    },

    getFractionOfUptime: function () {
      return this._getTotalUptime() / this._getTotalTime();
    },

    getAverageResponseTime: function () {
      return this.mean('avgresponse:mean');
    }

  });

  return AvailabilityCollection;
});
