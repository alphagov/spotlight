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
    collectionData: function () { return []; },

    renderView: function (options) {
      options = _.extend({}, this.viewOptions(), options);

      if (!this.view) {
        this.view = new this.viewClass(options);
      }

      var view = this.view;
      view.render();

      this.html = view.html || view.$el[0].outerHTML;
      setTimeout(_.bind(function () {
        this.trigger('ready');
      }, this), 0);
    },

    render: function (options) {
      options = options || {};

      if (this.collectionClass && !this.collection) {
        this.collection = new this.collectionClass(this.collectionData(), _.extend({
          'data-type': this.model.get('data-type'),
          'data-group': this.model.get('data-group')
        }, this.collectionOptions()));
      }

      var renderViewOptions = _.merge({
        collection: this.collection,
        model: this.model,
      }, options);

      if (this.collection && this.collection.isEmpty()) {
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

        if (!definition.controller) {
          // some modules don't have client-side controllers
          return;
        }

        var model = new Model(definition);
        model.set('parent', parentModel);

        var module = new definition.controller(
          _.merge({ model: model }, moduleOptions)
        );

        module.once('ready', _.bind(function () {
          remaining--;
          if (remaining === 0) {
            this.trigger('loaded');
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
