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

    viewOptions: function () {},
    collectionOptions: function () {},

    renderView: function (options) {
      options = _.extend({}, this.viewOptions(), options);
      
      if (!this.view) {
        this.view = new this.viewClass(options);
      }

      var view = this.view;
      view.render();
      
      this.html = view.html || view.$el[0].outerHTML;
      this.trigger('ready');
    },

    render: function (options) {
      options = options || {};

      if (this.collectionClass && !this.collection) {
        this.collection = new this.collectionClass([], _.extend({
          'data-type': this.model.get('data-type'),
          'data-group': this.model.get('data-group')
        }, this.collectionOptions()));
      }

      if (isClient && options.init && !this.clientRenderOnInit) {
        // Do not render on init when rendering in client
        return;
      }

      if (this.collection) {
        this.collection.once('sync reset error', function() {
          this.renderView({
            collection: this.collection,
            model: this.model
          });
        }, this);

        this.collection.fetch();
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
