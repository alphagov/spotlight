define([
  'client/controllers/module',
  'common/modules/tab',
  'common/views/visualisations/tab'
],
function (ModuleController, TabController, TabView) {

  var parent = ModuleController.extend(TabController);

  var TabModule = parent.extend({

    visualisationClass: TabView,

    initialize: function () {
      var controllerMap = TabModule.map;

      this.tabs = _.map(this.model.get('tabs'), function (tab) {
        tab.controller = controllerMap[tab['module-type']];
        return tab;
      }, this);

      this.on('ready', function () {
        this.listenTo(this.model, 'change:activeIndex', this.renderTabs, this);
        this.renderTabs();
      }, this);

      if (!this.model.has('activeIndex')) {
        this.model.set('activeIndex', 0);
      }

      parent.prototype.initialize.apply(this, arguments);
    },

    renderTabs: function () {
      var tab = this.tabs[this.model.get('activeIndex')];

      this.renderModules(
        [tab],
        this.model,
        { dashboard: true },
        {},
        _.bind(function () {
          var height = this.view.$('section').eq(this.model.get('activeIndex')).height();
          this.view.$('section').css('min-height', height);
        }, this)
      );
    }

  });

  return TabModule;

});
