define([
  'client/controllers/module',
  'common/modules/section',
  'extensions/views/view'
],
function (ModuleController, SectionController, View) {

  var parent = ModuleController.extend(SectionController);

  var SectionModule = parent.extend({

    visualisationClass: View,

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
