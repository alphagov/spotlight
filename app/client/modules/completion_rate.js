define([
  'client/controllers/module',
  'common/modules/completion_rate',
  'client/views/visualisations/completion-rate'
], function (ModuleController, CompletionRateModule, CompletionRateView) {

  return ModuleController.extend(CompletionRateModule).extend({

    visualisationClass: CompletionRateView

  });

});