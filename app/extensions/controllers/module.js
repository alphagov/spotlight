define([
  'extensions/controllers/controller',
  'common/views/module',
  'common/views/module_raw',
  'common/views/module_standalone'
], function (Controller, ModuleView, RawView, StandaloneView) {

  var ModuleController = Controller.extend({
    visualisationClass: null,

    initialize: function(options) {
      if (options.raw != null) {
        this.viewClass = RawView;
      } else if (options.dashboard) {
        this.viewClass = ModuleView;
      } else {
        this.viewClass = StandaloneView;
      }
    },

    viewOptions: function () {
      var options = {
        visualisationClass: this.visualisationClass,
        className: this.className
      };

      if (isClient) {
        // reuse existing module slot
        var el = $('.' + this.className);
        if (el.length) {
          options.el = el;
        }
      }

      return options;
    }
  });

  return ModuleController;

});
