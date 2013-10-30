define([
  'extensions/controller',
  'common/views/module'
], function (Controller, ModuleView) {

  var ModuleController = Controller.extend({
    visualisationClass: TBD,

    initialize: function(options) {
      if (options.raw) {
        this.viewClass = RawView;
      }
      else if (options.standalone) {
        this.viewClass = StandaloneView;
      }
      else {
        this.viewClass = ModuleView;
      }
    },

    render: function() {
      // pass visualisaton to view
    }
  });

  return ModuleController;

});
