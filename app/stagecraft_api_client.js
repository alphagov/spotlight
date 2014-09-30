define([
  'extensions/models/model'
],
function (Model) {
  var StagecraftApiClient = Model.extend({

    defaults: {
      status: 200
    },

    initialize: function (attrs, options) {
      this.controllers = options.ControllerMap;
      this.requestId = options.requestId || 'Not-Set';
      Model.prototype.initialize.apply(this, arguments);
    },

    setPath: function (path) {
      this.path = path;
      this.fetch();
    },

    url: function () {
      if(this.fallback) {
        if(this.path.length){
          return this.urlRoot + this.path;
        } else {
          return this.urlRoot + '/dashboards';
        }
      } else {
        if(this.path.length){
          return this.stagecraftUrlRoot + '?slug=' + this.path.replace(/^\//, '');
        } else {
          return this.stagecraftUrlRoot;
        }
      }
    },

    fallback: false,

    fetch: function (options) {
      options = _.extend({}, {
        validate: true,
        error: _.bind(function () {
          this.fetchFallback(options);
        }, this)
      }, options);
      logger.info('Fetching <%s>', this.url(), { request_id: this.requestId });
      Model.prototype.fetch.call(this, options);
    },

    fetchFallback: function (options) {
      this.fallback = true;
      options = _.extend({}, options, {
        validate: true,
        error: _.bind(function (model, xhr) {
          this.set('controller', this.controllers.error);
          this.set('status', xhr.status);
          this.set('errorText', xhr.responseText);
        }, this)
      });
      this.fetch(options);
      this.fallback = false;
    },

    parse: function (data, options) {
      var controller;
      var controllerMap = this.controllers || options.ControllerMap;

      controller = controllerMap[data['page-type']];

      if (data['page-type'] === 'module') {
        controller = controllerMap.dashboard;
      }

      _.each(data.modules, function (module) {
        module.controller = controllerMap.modules[module['module-type']];
        if (module.controller) {
          // requiring the controller map from within a module causes a circular dependency
          // so add the map as a property for modules that need it i.e. tabs
          module.controller.map = controllerMap.modules;
        }
      }, this);

      // the response from /dashboards in stagecraft doesn't return a page-type
      if (!controller && this.path && this.path.length) {
        data.controller = controllerMap.error;
        data.status = 501;
      } else {
        data.controller = controller;
      }
      return data;
    }

  });

  return StagecraftApiClient;
});
