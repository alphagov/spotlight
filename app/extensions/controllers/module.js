define([
  'extensions/controllers/controller',
  'common/views/module',
  'common/views/module_raw',
  'common/views/module_standalone'
], function (Controller, ModuleView, RawView, StandaloneView) {

  var ModuleController = Controller.extend({
    visualisationClass: null,

    initialize: function(options) {
      if (options.raw || options.raw === '') {
        this.viewClass = RawView;
      } else if (options.dashboard) {
        this.viewClass = ModuleView;
      } else {
        this.viewClass = StandaloneView;
      }
    },

    viewOptions: function () {
      return {
        visualisationClass: this.visualisationClass,
        className: this.className
      };
    }
  });

  return ModuleController;

});
