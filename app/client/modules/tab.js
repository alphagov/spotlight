define([
  'extensions/controllers/module',
  'common/views/visualisations/tab'
],
function (ModuleController, TabView) {

  var TabModule = ModuleController.extend({
    visualisationClass: TabView,
    clientRenderOnInit: true,
    requiresSvg: true,
    hasTable: false,

    initialize: function (options) {
      // for tests we want to be able to inject a custom controller map
      var controllerMap = options.controllerMap || require('controller_map');

      this.tabs = _.map(this.model.get('tabs'), function (tab) {
        tab.controller = controllerMap.modules[tab['module-type']];
        if (isServer) {
          tab.slug = this.model.get('slug') + '-' + tab.slug;
        }
        return tab;
      }, this);

      this.on('ready', this.renderTabs, this);

      if (!this.model.has('activeIndex')) {
        this.model.set('activeIndex', 0);
      }
      this.listenTo(this.model, 'change:activeIndex', this.renderTabs, this);

      ModuleController.prototype.initialize.apply(this, arguments);
    },

    renderTabs: function () {
      if (isServer) {
        return;
      }
      var tab = this.tabs[this.model.get('activeIndex')];

      this.renderModules(
        [tab],
        this.model,
        { dashboard: true },
        _.bind(function () {
          return {
            el: this.view.$('section').eq(this.model.get('activeIndex'))
          };
        }, this),
        _.bind(function () {
          var height = this.view.$('section').eq(this.model.get('activeIndex')).height();
          this.view.$('section').css('min-height', height);
        }, this)
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
