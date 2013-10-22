define([
  'extensions/models/model',
  'view_map'
],
function (Model, ViewMap) {
  var StagecraftApiClient = Model.extend({

    views: ViewMap,

    setPath: function (path) {
      this.path = path;
      this.fetch();
    },

    url: function () {
      return this.urlRoot + this.path;
    },

    fetch: function (options) {
      options = _.extend({}, options, {
        validate: true,
        error: _.bind(function(model, xhr, options) {
          this.set('view', this.views['error' + xhr.status] || this.views.error500);
          this.set('errorText', xhr.responseText);
        }, this)
      });
      Model.prototype.fetch.call(this, options);
    },

    parse: function (data) {
      var view = this.views[data['page-type']];
      if (!view) {
        data.view = this.views.error500;
        this.trigger('unknown', this);
      } else {
        data.view = view;
      }
      return data;
    }

  });

  return StagecraftApiClient;
});
