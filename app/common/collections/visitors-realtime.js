define([
  'extensions/collections/matrix'
],
function (MatrixCollection) {
  var VisitorsRealtimeCollection = MatrixCollection.extend({

    apiName: "realtime",

    queryParams: function () {
      return {
        sort_by: "_timestamp:descending",
        limit: this.options.numTwoMinPeriodsToQuery || (((60/2) * 24) + 2)
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

      return {
        id: 'realtime',
        title: 'Realtime',
        values: response.data.reverse()
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
