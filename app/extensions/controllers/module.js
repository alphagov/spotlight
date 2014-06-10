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
    hasTable: true,

    id: function () {
      return this.model.get('slug') || this.model.get('module-type');
    },

    className: function () {
      var classes = this.model.get('classes');
      if (classes && !_.isArray(classes)) {
        classes = [classes];
      }
      return ['module', this.model.get('module-type')].concat(classes || []).join(' ');
    },

    initialize: function (options) {
      if (isClient) {
        this.viewClass = ModuleView;
      } else if (options.raw) {
        this.viewClass = RawView;
      } else if (options.dashboard) {
        this.viewClass = ModuleView;
        this.url = this.url + '/' + this.id();
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
        visualisationOptions: this.visualisationOptions,
        className: this.className,
        id: this.id,
        requiresSvg: this.requiresSvg,
        url: this.url,
        hasTable: this.hasTable
      };

      if (isClient) {
        // reuse existing module slot
        var el = $('#' + this.id());
        if (el.length) {
          options.el = el;
        }
      }

      return options;
    },

    visualisationOptions: function () {
      return {
        valueAttr: this.model.get('value-attribute')
      };
    }
  });

  return ModuleController;

});
