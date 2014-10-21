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
          if(this.url && this.url.indexOf('?') !== -1){
            this.url = this.url.split('?')[0];
          }
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