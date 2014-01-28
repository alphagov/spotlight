define([
  'extensions/collections/matrix'
],
function (MatrixCollection) {
  var VisitorsRealtimeCollection = MatrixCollection.extend({

    apiName: "realtime",

    queryParams: function () {
      return {
        sort_by: "_timestamp:ascending",
        limit: this.options.numTwoMinPeriodsToQuery || 182
      };
    },

    updateInterval: 120 * 1000,

    initialize: function (models, options) {
      MatrixCollection.prototype.initialize.apply(this, arguments);

      if (isClient) {
        clearInterval(this.timer);
        this.timer = setInterval(
          _.bind(this.fetch, this), this.updateInterval
        );
      }
    },

    parse: function (response) {

      _.each(response.data, function(d) {
        d.unique_visitors = parseFloat(d.unique_visitors);
      });

      return {
        id: 'realtime',
        title: 'Realtime',
        values: response.data
      };

    },

    fetch: function (options) {
      options = _.extend({
        headers: {
          "cache-control": "max-age=120"
        }
      }, options);
      MatrixCollection.prototype.fetch.call(this, options);
    }
  });

  return VisitorsRealtimeCollection;
});
