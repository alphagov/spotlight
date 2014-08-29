define([
  'client/controllers/module',
  'common/modules/tab',
  'client/views/visualisations/tab'
],
function (ModuleController, TabController, TabView) {

  var parent = ModuleController.extend(TabController);

  var TabModule = parent.extend({

    visualisationClass: TabView,

    initialize: function () {

      this.tabs = _.map(this.model.get('tabs'), function (tab) {
        tab.controller = this.map[tab['module-type']];
        return tab;
      }, this);

      if (!this.model.has('activeIndex')) {
        this.model.set('activeIndex', 0);
      }

      parent.prototype.initialize.apply(this, arguments);
    },

    ready: function () {
      this.listenTo(this.model, 'change:activeIndex', this.renderTabs, this);
      this.renderTabs();
    },

    renderTabs: function () {
      var tab = this.tabs[this.model.get('activeIndex')];
      if (tab.rendered) {
        return;
      }
      this.renderModules(
        [tab],
        this.model.get('parent'),
        {},
        {},
        _.bind(function () {
          var height = this.view.$('section').eq(this.model.get('activeIndex')).height();
          this.view.$('section').css('min-height', height);
          ModuleController.prototype.ready.call(this);
          tab.rendered = true;
        }, this)
      );
    }

  });

  return TabModule;

});
