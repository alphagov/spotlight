define([
  'client/controllers/module',
  'common/modules/journey',
  'common/views/visualisations/journey-graph/journey-graph'
], function (ModuleController, JourneyModule, JourneyView) {

  return ModuleController.extend(JourneyModule).extend({

    visualisationClass: JourneyView,

    visualisationOptions: function () {
      return _.defaults(ModuleController.prototype.visualisationOptions.apply(this, arguments), {
        valueAttr: 'uniqueEvents'
      });
    }

  });

});