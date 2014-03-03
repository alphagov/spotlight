define([
  'extensions/collections/matrix'
],
function (MatrixCollection) {
  var AvailabilityCollection = MatrixCollection.extend({

    queryParams: function () {
      return {
        period: 'day',
        collect: ['downtime:sum', 'uptime:sum', 'unmonitored:sum', 'avgresponse:mean']
      };
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
    },

    getDataByTableFormat: function (valueAttr) {
      if (this.options.axes) {
        var allTables = [],
          availabilityTitle = {
            avgresponse: 'Page load time',
            uptimeFraction: 'Uptime'
          },
          formatDate = (this.options.valueAttr === 'hour') ? 'h:mm:ss a' : 'D MMMM',
          dateKey = this.options.axes.x.key,
          attributeTitle = availabilityTitle[valueAttr] || this.options.axes.y.label,
          valueAttribute = valueAttr || this.options.axes.y.key,
          tableHeadings = [];

        tableHeadings.push(this.options.axes.x.label, attributeTitle);

        allTables.push(tableHeadings);

        _.each(this.models[0].get('values').models, function (model) {
          var tableRow = [];
          tableRow[0] = this.getMoment(model.get(dateKey))
            .format(formatDate);
          tableRow[1] = model.get(valueAttribute);

          allTables.push(tableRow);
        }, this);

        return allTables;
      }

      return MatrixCollection.prototype.getDataByTableFormat.apply(this, arguments);
    }

  });

  return AvailabilityCollection;
});
