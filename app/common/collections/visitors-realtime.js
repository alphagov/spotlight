define([
  'extensions/collections/matrix'
],
function (MatrixCollection) {
  var VisitorsRealtimeCollection = MatrixCollection.extend({

    apiName: 'realtime',

    queryParams: function () {
      return {
        sort_by: '_timestamp:descending',
        limit: this.options.numTwoMinPeriodsToQuery || (((60 / 2) * 24) + 2)
      };
    },

    updateInterval: 120 * 1000,

    initialize: function () {
      MatrixCollection.prototype.initialize.apply(this, arguments);

      if (isClient) {
        clearInterval(this.timer);
        this.timer = setInterval(
          _.bind(this.fetch, this), this.updateInterval
        );
      }
    },

    parse: function (response) {

      _.each(response.data, function (d) {
        d.unique_visitors = parseFloat(d.unique_visitors);
      });

      return {
        id: 'realtime',
        title: 'Realtime',
        values: response.data.reverse()
      };

    },

    fetch: function (options) {
      options = _.extend({
        headers: {
          'cache-control': 'max-age=120'
        }
      }, options);
      MatrixCollection.prototype.fetch.call(this, options);
    },

    getDataByTableFormat: function () {
      if (this.options.axisLabels) {
        var allTables = [],
          dateKey = this.options.axisLabels.x.key,
          seriesData = this.options.axisLabels.y.key,
          tableHeadings = [];

        tableHeadings.push(this.options.axisLabels.x.label, this.options.axisLabels.y.label);

        allTables.push(tableHeadings);

        _.each(this.models[0].get('values').models, function (model) {
          var tableRow = [];
          tableRow[0] = this.getMoment(model.get(dateKey))
            .format('h:mm:ss a');
          tableRow[1] = model.get(seriesData);

          allTables.push(tableRow);
        }, this);

        return allTables;
      }

      return MatrixCollection.prototype.getDataByTableFormat.apply(this, arguments);
    }
  });

  return VisitorsRealtimeCollection;
});
