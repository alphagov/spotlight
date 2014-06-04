var requirejs = require('requirejs');

var ModuleController = require('../controllers/module');
var TabController = requirejs('common/modules/tab');
var TabView = require('../views/modules/tab');

var parent = ModuleController.extend(TabController);

var TabModule = parent.extend({
  visualisationClass: TabView,

  initialize: function () {
    this.tabs = _.map(this.model.get('tabs'), function (tab) {
      tab.controller = TabModule.map[tab['module-type']];
      tab.slug = this.model.get('slug') + '-' + tab.slug;
      return tab;
    }, this);

    parent.prototype.initialize.apply(this, arguments);
  },

  render: function () {

    this.tabModules = this.renderModules(this.tabs, this.model, { dashboard: true }, {}, function () {
      this.model.set('tabs', _.map(this.tabModules, function (module) {
        return _.extend(module.model.toJSON(), { html: module.html });
      }));
      parent.prototype.render.apply(this);
    }.bind(this));

  }

});

module.exports = TabModule;
