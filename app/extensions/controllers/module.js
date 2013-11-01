define([
  'extensions/controllers/controller',
  'common/views/module',
  'common/views/module_raw'
], function (Controller, ModuleView, RawView) {

  var ModuleController = Controller.extend({
    visualisationClass: null,

    initialize: function(options) {
      if (options.raw || options.raw === '') {
        this.viewClass = RawView;
      } else {
        this.viewClass = ModuleView;
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
