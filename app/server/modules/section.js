var requirejs = require('requirejs');

var ModuleController = require('../controllers/module');
var SectionController = requirejs('common/modules/section');
var SectionView = require('../views/modules/section');

var parent = ModuleController.extend(SectionController);

var SectionModule = parent.extend({
  visualisationClass: SectionView,

  initialize: function () {
    this.modules = _.map(this.model.get('modules'), function (module) {
      module.controller = SectionModule.map[module['module-type']];
      return module;
    }, this);

    parent.prototype.initialize.apply(this, arguments);
  },

  render: function () {
    this.sectionModules = this.renderModules(
      this.modules,
      this.model.get('parent'),
      function (model) {
        return {
          url: this.url + '/' + model.get('slug')
        };
      }.bind(this),
      {},
      function () {
        this.model.set('modules', _.map(this.sectionModules, function (module) {
          return _.extend(module.model.toJSON(), { html: module.html });
        }));
        parent.prototype.render.apply(this);
      }.bind(this)
    );

  }

});

module.exports = SectionModule;
