define([
  'client/controllers/module',
  'common/modules/completion_rate',
  'common/views/visualisations/completion_rate'
], function (ModuleController, CompletionRateModule, CompletionRateView) {

  return ModuleController.extend(CompletionRateModule).extend({

    visualisationClass: CompletionRateView

  });

});