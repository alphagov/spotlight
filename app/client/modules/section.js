define([
  'client/controllers/module',
  'common/modules/section',
  'client/views/visualisations/section'
],
function (ModuleController, SectionController, SectionView) {

  var parent = ModuleController.extend(SectionController);

  var SectionModule = parent.extend({

    visualisationClass: SectionView,

    initialize: function () {
      var controllerMap = SectionModule.map;

      this.modules = _.map(this.model.get('modules'), function (module) {
        module.controller = controllerMap[module['module-type']];
        return module;
      }, this);

      parent.prototype.initialize.apply(this, arguments);
    },

    ready: function () {
      this.renderModules(
        this.modules,
        this.model.get('parent'),
        {},
        {},
        _.bind(function () {
          ModuleController.prototype.ready.call(this);
        }, this)
      );
    }

  });

  return SectionModule;

});
