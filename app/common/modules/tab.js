define([
  'extensions/controllers/module',
  'common/views/visualisations/tab'
],
function (ModuleController, TabView) {

  var TabModule = ModuleController.extend({
    visualisationClass: TabView,
    clientRenderOnInit: true,
    requiresSvg: false,

    initialize: function (options) {
      // for tests we want to be able to inject a custom controller map
      var controllerMap = options.controllerMap || require('controller_map');

      this.tabs = _.map(this.model.get('tabs'), function (tab) {
        tab.controller = this.getControllerForModule(tab, controllerMap);
        return tab;
      }, this);

      this.on('ready', this.renderTabs, this);
      this.listenTo(this.model, 'change:activeIndex', this.renderTabs, this);

      ModuleController.prototype.initialize.apply(this, arguments);
    },

    getControllerForModule: function (module, controllerMap) {
      return controllerMap.modules[module['module-type']];
    },

    renderTabs: function () {
      this.renderModules(
        [this.tabs[this.model.get('activeIndex')]],
        this.model,
        { dashboard: true },
        _.bind(function (tab) {
          return {
            el: this.view.getVisualisation().getModuleElementBySlug(tab.get('slug'))
          };
        }, this),
        function () { }
      );
    },

    visualisationOptions: function () {
      return {
        tabs: this.model.get('tabs')
      };
    }

  });

  return TabModule;

});
