define([
  'client/controllers/module',
  'common/modules/completion_numbers',
  'common/views/visualisations/completion_numbers'
], function (ModuleController, CompletionNumbersModule, CompletionNumbersView) {

  return ModuleController.extend(CompletionNumbersModule).extend({

    visualisationClass: CompletionNumbersView

  });

});