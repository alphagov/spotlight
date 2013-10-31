define([
  'extensions/controllers/controller',
  'common/views/module'
], function (Controller, ModuleView) {

  var ModuleController = Controller.extend({
    visualisationClass: null,

    initialize: function(options) {
      // if (options.raw) {
      //   this.viewClass = RawView;
      // }
      // else if (options.standalone) {
      //   this.viewClass = StandaloneView;
      // }
      // else {
        this.viewClass = ModuleView;
      // }
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
