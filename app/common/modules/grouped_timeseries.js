define([
  'common/collections/grouped_timeseries',
  'common/collections/grouped_timeshift'
],
function (GroupedTimeseriesCollection, GroupedTimeshiftCollection) {

  return {
    requiresSvg: true,
    hasDatePicker: true,
    initialize: function () {

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

    collectionOptions: function () {
      return {
        valueAttr: this.model.get('value-attribute'),
        category: this.model.get('category'),
        isOneHundredPercent: this.model.get('one-hundred-percent'),
        useStack: this.model.get('use_stack'),
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
    },

    visualisationOptions: function () {
      return {
        valueAttr: this.model.get('value-attribute'),
        formatOptions: this.model.get('format')
      };
    }

  };

});
