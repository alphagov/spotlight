define([
  'backbone',
  'extensions/models/model',
  'extensions/views/error',
  'extensions/mixins/performance'
], function (Backbone, Model, ErrorView, Performance) {

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

    renderView: function (options, diffTimers) {
      options = _.extend({}, this.viewOptions(), options);

      if (!this.view) {
        this.view = new this.viewClass(options);
      }

      var view = this.view;

      Performance.timeIt(
        'module-' + this.model.get('slug') + '-render',
        this.getRequestIdMap(),
        function () {
          view.render();

          this.html = view.html || view.$el[0].outerHTML;
        }.bind(this),
        diffTimers
      );

      this.ready();
    },

    ready: function () {
      setTimeout(_.bind(function () {
        this.trigger('ready');
      }, this), 0);
    },

    getRequestIdMap: function () {
      var parentModel = this.model.get('parent'),
          requestId = 'Not-Set',
          govukRequestId = 'Not-Set';

      if (parentModel) {
        requestId = parentModel.get('requestId') || 'Not-Set';
        govukRequestId = parentModel.get('govukRequestId') || 'Not-Set';
      }
      
      return {
        request_id: requestId,
        govuk_request_id: govukRequestId
      };
    },

    render: function (options) {
      options = options || {};

      if (this.collectionClass && !this.collection) {
        this.collection = new this.collectionClass(this.collectionData(), _.extend({
          dataSource: this.model.get('data-source'),
          flattenEverything: true
        }, this.getRequestIdMap(), this.collectionOptions()));
      }

      var renderViewOptions = _.merge({
            collection: this.collection,
            model: this.model
          }, options),
          slug = this.model.get('slug');

      var diffTimers = Performance.timerDiff('module-' + slug + '-diff');

      if (this.collection && this.collection.isEmpty()) {
        Performance.timeCollection(
          'module-' + slug + '-data',
          this.getRequestIdMap(),
          this.collection,
          diffTimers
        );

        this.listenToOnce(this.collection, 'reset', function () {
          this.renderView(renderViewOptions, diffTimers);
        }, this);
        this.listenToOnce(this.collection, 'error', function () {
          this.viewClass = ErrorView;
          this.renderView(renderViewOptions, diffTimers);
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
