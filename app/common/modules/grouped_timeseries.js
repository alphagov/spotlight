define([
  'extensions/controllers/module',
  'common/collections/grouped_timeseries',
  'common/collections/grouped_timeshift',
  'common/views/visualisations/grouped_timeseries'
],
function (ModuleController, GroupedTimeseriesCollection, GroupedTimeshiftCollection, GroupedTimeseriesView) {

  var GroupedTimeseriesModule = ModuleController.extend({
    initialize: function () {
      ModuleController.prototype.initialize.apply(this, arguments);

      var containsTimeshift = false,
          axes = this.model.get('axes');
      if (axes && axes.y) {
        containsTimeshift = _.any(axes.y, function (series) {
          return series.timeshift;
        });
      }
      if (containsTimeshift) {
        this.collectionClass = GroupedTimeshiftCollection;
      } else  {
        this.collectionClass = GroupedTimeseriesCollection;
      }
    },
    visualisationClass: GroupedTimeseriesView,
    clientRenderOnInit: true,
    requiresSvg: true,
    collectionOptions: function () {
      return {
        tabs: this.model.get('tabs'),
        valueAttr: this.model.get('value-attribute'),
        category: this.model.get('category'),
        period: this.model.get('period'),
        startAt: this.model.get('start-at'),
        endAt: this.model.get('end-at'),
        currency: this.model.get('currency'),
        seriesList: this.model.get('series'),
        filterBy: this.model.get('filter-by'),
        showTotalLines: this.model.get('show-total-lines'),
        duration: this.model.get('duration'),
        axisPeriod: this.model.get('axis-period'),
        groupMapping: this.model.get('group-mapping'),
        axes: _.merge({
          x: {
            label: 'Date',
            key: '_start_at',
            format: {
              type: 'date',
              format: 'MMMM YYYY'
            }
          },
          y: []
        }, this.model.get('axes'))
      };
    }

  });

  return GroupedTimeseriesModule;
});
