define([
  'backbone'
], function (Backbone) {

  var Controller = function(options) {
    options = options || {};
    _.extend(this, options);
    this.initialize.call(this, options);
  };

  _.extend(Controller.prototype, Backbone.Events, {
    initialize: function (options) {},

    renderView: function (options) {
      var view = this.view = new this.viewClass(options);

      view.render();

      this.html = view.html || view.$el.html();

      this.trigger('ready');
    },

    render: function () {
      if (this.collectionClass) {
        var collection = this.collection = new this.collectionClass([], {
          'data-type': this.model.get('data-type'),
          'data-group': this.model.get('data-group')
        });

        collection.once('sync', function() {
          this.renderView({
            collection: collection,
            model: this.model
          });
        }, this);

        collection.fetch();
      } else {
        this.renderView({
          model: this.model
        });
      }
    }
  });

  Controller.extend = Backbone.Model.extend;

  return Controller;

});
