define([
  './tab',
  'client/controllers/module',
],
function (TabController, ModuleController) {

  return TabController.extend({

    visualisationClass: null,

    initialize: function () {

      this.modules = _.map(this.model.get('modules'), function (tab) {
        tab.controller = this.map[tab['module-type']];
        return tab;
      }, this);

      ModuleController.prototype.initialize.apply(this, arguments);
    },

    renderTabs: function () {
      this.renderModules(
        this.modules,
        this.model.get('parent'),
        {},
        {},
        ModuleController.prototype.ready.bind(this)
      );
    }

  });

});
