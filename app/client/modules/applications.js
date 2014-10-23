define([
  'client/controllers/module',
  'common/modules/applications',
  'client/views/visualisations/applications'
],
function (ModuleController, ApplicationsController, ApplicationsView) {

  return ModuleController.extend(ApplicationsController).extend({
    visualisationClass: ApplicationsView
  });

});
