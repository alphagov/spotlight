define([
  'client/controllers/module',
  'common/modules/column',
  'client/views/visualisations/column'
],
function (ModuleController, ColumnController, ColumnView) {

  return ModuleController.extend(ColumnController).extend({
    visualisationClass: ColumnView
  });

});
