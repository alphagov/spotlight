define([
  'backbone'
], function (Backbone) {

  var Controller = function(options) {
    this.initialize.apply(this, arguments);
  };

  _.extend(Controller.prototype, Backbone.Events, {
    initialize: function (options) {
      this.layout_context = options.layout_context;
    },

    render: function () {
      var collection = new this.collectionClass([], this.model);

      collection.once('sync', function() {
        var view = new viewClass({
          collection: collection,
          model: model
        });

        view.render();

        this.trigger('ready');
      }, this);

      collection.fetch();
    }
  });

  Controller.extend = Backbone.Model.extend;

  return Controller;

});
