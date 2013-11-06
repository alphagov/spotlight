define([
  'extensions/controllers/controller',
  'common/views/dashboard',
  'extensions/models/model'
], function (Controller, DashboardView, Model) {

  var DashboardController = Controller.extend({

    viewClass: DashboardView,
    viewOptions: function () {
      return {
        moduleInstances: this.moduleInstances
      };
    },

    render: function () {
      var modules = this.model.get('modules') || [];
      var remaining = modules.length;

      var onReady = _.bind(function() {
        if (--remaining > 0) {
          return;
        }
        Controller.prototype.render.apply(this, arguments);
      }, this);

      if (!remaining) {
        Controller.prototype.render.apply(this, arguments);
      } else {

        var instances = this.moduleInstances = [];
        _.each(modules, function(definition) {
          var model = new Model(definition);
          model.set('parent', this.model);
          var module = new definition.controller({
            model: model,
            dashboard: true
          });
          instances.push(module);
          module.once('ready', onReady);
          module.render();
        }, this);
      }
    }
  });

  return DashboardController;

});
