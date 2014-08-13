define([
  'client/controllers/module',
  'common/modules/user_satisfaction_graph',
  'client/views/visualisations/user-satisfaction-graph'
], function (ModuleController, UserSatisfactionModule, UserSatisfactionView) {

  return ModuleController.extend(UserSatisfactionModule).extend({

    visualisationClass: UserSatisfactionView

  });

});