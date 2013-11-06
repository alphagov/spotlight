define([
  'extensions/collections/collection'
],
function (Collection) {
  var VisitorsRealtimeCollection = Collection.extend({

    apiName: "realtime",

    queryParams: {
      sort_by: "_timestamp:descending",
      limit: 1
    },

    updateInterval: 120 * 1000,

    initialize: function (models, options) {
      Collection.prototype.initialize.apply(this, arguments);

      this.serviceName = options.serviceName;

      if (isClient) {
        this.timer = setInterval(
          _.bind(this.fetch, this), this.updateInterval
        );
      }
    },

    parse: function (response) {
      return response.data;
    },

    fetch: function (options) {
      options = _.extend({
        ifModified: true,
        headers: {
          "cache-control": "max-age=120"
        }
      }, options);
      Collection.prototype.fetch.call(this, options);
    }
  });
  return VisitorsRealtimeCollection;
});
