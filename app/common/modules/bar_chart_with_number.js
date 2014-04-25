define([
  'extensions/controllers/module',
  'common/views/visualisations/bar_chart_with_number',
  'common/collections/bar_chart_with_number'
],
function (ModuleController, BarChartWithNumberView, BarChartWithNumberCollection) {
  var BarChartWithNumberModule = ModuleController.extend({
    visualisationClass: BarChartWithNumberView,
    collectionClass: BarChartWithNumberCollection,
    clientRenderOnInit: true,
    requiresSvg: true,

    collectionOptions: function () {
      var valueAttr = this.model.get('value-attribute');
      return {
        queryParams: this.model.get('query-params'),
        valueAttr: valueAttr,
        axisPeriod: this.model.get('axis-period'),
        axes: _.merge({
          x: {
            label: 'Dates',
            key: ['_start_at', 'end_at'],
            format: 'dateRange'
          },
          y: [
            {
              label: 'Number of applications',
              key: valueAttr,
              format: 'integer'
            }
          ]
        }, this.model.get('axes'))
      };
    }
  });

  return BarChartWithNumberModule;
});
