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

    parse: function (response) {
      var data = response.data;
      _.each(data, function (d) {
        d.uptime = d['uptime:sum'];
        d.downtime = d['downtime:sum'];
        d.unmonitored = d['unmonitored:sum'];
        d.avgresponse = d['avgresponse:mean'];
        if (d.downtime === null && d.uptime === null) {
          d.total = null;
          d.uptimeFraction = null;
        } else {
          d.total = d.downtime + d.uptime;
          d.uptimeFraction = d.uptime / d.total;
        }
        d._end_at = this.getMoment(d._end_at);
        d._start_at = this.getMoment(d._start_at);
        d._timestamp = d._start_at;
      }, this);
      return data;
    },

    _getTotalUptime: function () {
      return this.total('uptime');
    },

    _getTotalTime: function (includeUnmonitored) {
      return this.reduce(function (memo, model) {
        var res = memo + model.get('total');
        if (includeUnmonitored) {
          res += model.get('unmonitored');
        }
        return res;
      }, 0);
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
