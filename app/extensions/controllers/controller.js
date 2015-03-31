define([
  'backbone',
  'extensions/models/model',
  'extensions/views/error'
], function (Backbone, Model, ErrorView) {

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

    cacheOptions: function() { return 'public, max-age=600'; },

    renderView: function (options) {
      options = _.extend({}, this.viewOptions(), options);

      if (!this.view) {
        this.view = new this.viewClass(options);
      }

      var view = this.view;
      view.render();

      this.html = view.html || view.$el[0].outerHTML;
      this.ready();
    },

    ready: function () {
      setTimeout(_.bind(function () {
        this.trigger('ready');
      }, this), 0);
    },

    render: function (options) {
      options = options || {};

      var getRequestId = function(m) {
        if (m.get('parent')) {
          return m.get('parent').get('requestId');
        }
        return null;
      };

      var getGOVUKRequestId = function(m) {
        if (m.get('parent')) {
          return m.get('parent').get('govukRequestId');
        }
        return null;
      };

      if (this.collectionClass && !this.collection) {
        this.collection = new this.collectionClass(this.collectionData(), _.extend({
          dataSource: this.model.get('data-source'),
          flattenEverything: true,
          requestId: getRequestId(this.model),
          govukRequestId: getGOVUKRequestId(this.model)
        }, this.collectionOptions()));
      }

      var renderViewOptions = _.merge({
        collection: this.collection,
        model: this.model
      }, options);

      if (this.collection && this.collection.isEmpty()) {
        this.listenToOnce(this.collection, 'reset', function () {
          this.renderView(renderViewOptions);
        }, this);
        this.listenToOnce(this.collection, 'error', function () {
          this.viewClass = ErrorView;
          this.renderView(renderViewOptions);
        }, this);

        this.collection.fetch({ reset: true });
      } else {
        this.renderView(renderViewOptions);
      }
    },

    renderModules: function (modules, parentModel, moduleOptions, renderOptions, callback) {
      var remaining = modules.length;

      callback = _.isFunction(callback) ? callback : function () {};
      if (remaining === 0) {
        callback();
        return;
      }

      var loaded = _.bind(function () {
        remaining--;
        if (remaining === 0) {
          this.trigger('loaded');
          callback();
        }
      }, this);

      return _.map(modules, function (definition) {

        if (!definition.controller) {
          // some modules don't have client-side controllers
          loaded();
          return;
        }

        var model = new Model(definition);
        model.set('parent', parentModel);
        model.set('params', parentModel.get('params'));
        var options = _.isFunction(moduleOptions) ? moduleOptions(model) : moduleOptions;

        var module = new definition.controller(_.merge({ model: model }, options));

        module.once('ready', loaded);

        module.render(_.isFunction(renderOptions) ? renderOptions(model) : renderOptions);

        return module;
      }, this);
    }
  });

  Controller.extend = Backbone.Model.extend;

  return Controller;

});
