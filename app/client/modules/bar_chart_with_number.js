define([
  'client/controllers/module',
  'common/modules/bar_chart_with_number',
  'client/views/visualisations/bar_chart_with_number'
],
function (ModuleController, BarChartController, BarChartView) {

  return ModuleController.extend(BarChartController).extend({
    visualisationClass: BarChartView
  });

});
