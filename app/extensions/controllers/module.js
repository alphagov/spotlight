define([
  'extensions/controllers/controller',
  'modernizr'
], function (Controller, Modernizr) {

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

    viewOptions: function () {
      var pageType = this.model.get('parent').get('page-type');
      var options = {
        visualisationClass: this.visualisationClass,
        visualisationOptions: this.visualisationOptions,
        className: this.className,
        id: this.id,
        requiresSvg: this.requiresSvg,
        url: pageType !== 'module' ? this.url + '/' + this.id() : this.url,
        hasTable: this.hasTable
      };

      return options;
    },

    visualisationOptions: function () {
      return {
        valueAttr: this.model.get('value-attribute'),
        url: this.url
      };
    }
  });

  return ModuleController;

});
