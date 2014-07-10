define([
  'common/collections/realtime'
], function (Collection) {

  return Collection.extend({

    initialize: function () {
      Collection.prototype.initialize.apply(this, arguments);
      if (_.isNumber(this.options.updateInterval)) {
        clearInterval(this.timer);
        this.timer = setInterval(
          _.bind(function () {
            this.fetch({ reset: true });
          }, this), this.options.updateInterval
        );
      }
    },

    fetch: function (options) {
      var maxAge = this.options.updateInterval / 1000;
      options = options || {};
      options.headers = options.headers || {};
      _.extend(options.headers, { 'cache-control': 'max-age=' + maxAge });
      return Collection.prototype.fetch.call(this, options);
    }

  });

});