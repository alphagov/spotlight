define([
  'extensions/controllers/module',
  'client/views/module'
], function (ModuleController, ModuleView) {

  return ModuleController.extend({

    viewClass: ModuleView,

    render: function () {
      if ($('.no-js')) {
        $('.no-js').removeClass('no-js');
      }
      if (this.requiresSvg && !this.Modernizr.inlinesvg) {
        // Do not try to render an SVG in a non-SVG browser
        this.trigger('ready');
        return;
      }
      ModuleController.prototype.render.apply(this, arguments);
    },

    viewOptions: function () {
      var options = ModuleController.prototype.viewOptions.apply(this, arguments);

      // reuse existing module slot
      var el = $('#' + this.id());
      if (el.length) {
        options.el = el;
      }
      return options;
    }

  });


});