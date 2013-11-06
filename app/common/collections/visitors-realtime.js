define([
  'extensions/collections/collection'
],
function (Collection) {
  var VisitorsRealtimeCollection = Collection.extend({

    apiName: "realtime",

    queryParams: {
      sort_by: "_timestamp:descending",
      limit: 2
    },

    initialize: function (models, options) {
      Collection.prototype.initialize.apply(this, arguments);

      this.serviceName = options.serviceName;
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
