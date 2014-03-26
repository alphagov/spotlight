define([
  'extensions/controllers/controller',
  'common/views/dashboard',
  'extensions/models/model'
], function (Controller, DashboardView, Model) {

  var DashboardController = Controller.extend({

    viewClass: DashboardView,

    initialize: function () {
      this.modules = this.model.get('modules') || [];
      this.moduleInstances = [];
    },

    viewOptions: function () {
      return {
        moduleInstances: this.moduleInstances
      };
    },

    render: function (options) {
      options = options || {};

      this.moduleInstances = this.renderModules(
        this.modules, 
        this.model,
        {
          dashboard: true,
          url: this.url
        },
        { init: options.init },
        Controller.prototype.render.bind(this, options)
      );
    }
  });

  return DashboardController;

});
