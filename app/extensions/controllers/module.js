define([
  'extensions/controllers/controller',
  'modernizr',
  'common/views/module',
  'common/views/module_raw',
  'common/views/module_standalone'
], function (Controller, Modernizr, ModuleView, RawView, StandaloneView) {

  var ModuleController = Controller.extend({
    Modernizr: Modernizr,

    visualisationClass: null,
    requiresSvg: false,

    initialize: function(options) {
      if (isClient) {
        this.viewClass = ModuleView;
      } else if (options.raw != null) {
        this.viewClass = RawView;
      } else if (options.dashboard) {
        this.viewClass = ModuleView;
        this.url = this.url + '/' + this.className;
      } else {
        this.viewClass = StandaloneView;
      }
    },

    render: function () {
      if (isClient && this.requiresSvg && !this.Modernizr.inlinesvg) {
        // Do not try to render an SVG in a non-SVG browser
        this.trigger('ready');
        return;
      }
      Controller.prototype.render.apply(this, arguments);
    },

    viewOptions: function () {
      var options = {
        visualisationClass: this.visualisationClass,
        className: this.className,
        requiresSvg: this.requiresSvg,
        url: this.url
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
