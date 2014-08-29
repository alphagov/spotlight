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
      Model.prototype.initialize.apply(this, arguments);
    },

    setPath: function (path) {
      this.path = path;
      this.fetch();
    },

    url: function () {
      if(!!this.fallback == false) {
        return this.stagecraftUrlRoot + '?slug=' + this.path;
      } else {
        return this.urlRoot + this.path;
      }
    },

    fallback: false, 

    fetch: function (options) {
      options = _.extend({}, {
        validate: true,
        error: _.bind(function (model, xhr) {
          this.fetchFallback();
        }, this)
      }, options);
      logger.info('Fetching <%s>', this.url());
      Model.prototype.fetch.call(this, options);
    },

    fetchFallback: function () {
      this.fallback = true;
      options = _.extend({}, {
        validate: true,
        error: _.bind(function (model, xhr) {
          this.set('controller', this.controllers.error);
          this.set('status', xhr.status);
          this.set('errorText', xhr.responseText);
        }, this)
      });
      var fetch_result = this.fetch(options);
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

      if (!controller) {
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
