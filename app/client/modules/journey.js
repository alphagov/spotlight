define([
  'client/controllers/module',
  'common/modules/journey',
  'common/views/visualisations/journey-graph/journey-graph'
], function (ModuleController, JourneyModule, JourneyView) {

  return ModuleController.extend(JourneyModule).extend({

    visualisationClass: JourneyView

  });

});