define([
  'extensions/controllers/controller'
], function (Controller) {
  return Controller.extend({

    renderDashboard: function (options, callback) {
      options = options || {};
      this.moduleInstances = this.renderModules(
        this.modules,
        this.model,
        function (model) {
          return {
            url: model.get('parent').get('page-type') === 'module' ? this.url : this.url + '/' + model.get('slug')
          };
        }.bind(this),
        { init: options.init },
        callback
      );
    }

  });
});