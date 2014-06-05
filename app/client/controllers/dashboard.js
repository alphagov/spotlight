define([
  'extensions/controllers/controller'
], function (Controller) {
  return Controller.extend({

    initialize: function () {
      this.modules = this.model.get('modules') || [];
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
        _.bind(function () { this.trigger('ready'); }, this)
      );
    }
  });
});
