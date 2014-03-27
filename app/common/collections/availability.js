define([
  'extensions/collections/matrix'
],
function (MatrixCollection) {
  var AvailabilityCollection = MatrixCollection.extend({

    queryParams: function () {
      var params = {
        period: 'day',
        collect: ['downtime:sum', 'uptime:sum', 'unmonitored:sum', 'avgresponse:mean']
      };
      params.end_at = this.options.endAt || null;
      return params;
    },

    initialize: function () {
      MatrixCollection.prototype.initialize.apply(this, arguments);
      this.query.on('change:' + this.options.tabbedAttr, function (model, value) {
        var activeTab = _.find(this.options.tabs, function (tab) {
          return tab.id === value;
        });
        if (activeTab && activeTab.format) {
          this.options.axes.x.format = activeTab.format;
        }
      }, this);
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
      return {
        id: 'availability',
        title: 'Availability',
        values: data
      };
    },

    _getTotalUptime: function () {
      return this.at(0).get('values').reduce(function (memo, model) {
        return memo + model.get('uptime');
      }, 0);
    },

    _getTotalTime: function (includeUnmonitored) {
      return this.at(0).get('values').reduce(function (memo, model) {
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
      var values = this.at(0).get('values');
      var total = values.reduce(function (memo, model) {
        return memo + model.get('avgresponse');
      }, 0);
      if (total === 0) {
        return null;
      } else {
        return total / values.length;
      }
    }

  });

  return AvailabilityCollection;
});
