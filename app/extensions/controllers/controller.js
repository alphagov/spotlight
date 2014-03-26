define([
  'backbone',
  'extensions/models/model'
], function (Backbone, Model) {

  var Controller = function (options) {
    options = options || {};
    _.extend(this, options);
    this.initialize.call(this, options);
  };

  _.extend(Controller.prototype, Backbone.Events, {

    initialize: function () {},

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
        this.trigger('ready');
        return;
      }

      var renderViewOptions = _.merge({
        collection: this.collection,
        model: this.model,
      }, options);

      if (this.collection) {
        this.listenToOnce(this.collection, 'sync reset error', function () {
          this.renderView(renderViewOptions);
        }, this);

        this.collection.fetch();
      } else {
        this.renderView(renderViewOptions);
      }
    },

    renderModules: function (modules, parentModel, moduleOptions, renderOptions, callback) {
      var remaining = modules.length;

      if (remaining === 0) {
        callback();
        return;
      }

      return _.map(modules, function (definition) {
        var model = new Model(definition);
        model.set('parent', parentModel);

        var module = new definition.controller(
          _.merge({ model: model }, moduleOptions)
        );

        module.once('ready', _.bind(function () {
          remaining = remaining - 1;

          if (remaining === 0) {
            callback();
          }
        }, this));

        module.render(_.isFunction(renderOptions) ? renderOptions(model) : renderOptions);

        return module;
      }, this);
    }
  });

  Controller.extend = Backbone.Model.extend;

  return Controller;

});
