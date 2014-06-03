define([
  'common/collections/grouped_timeseries',
  'common/collections/grouped_timeshift'
],
function (GroupedTimeseriesCollection, GroupedTimeshiftCollection) {

  return {
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
        isOneHundredPercent: this.model.get('one-hundred-percent'),
        useStack: this.model.get('use_stack'),
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
    },

    visualisationOptions: function () {
      return {
        currency: this.model.get('currency'),
        valueAttr: this.model.get('value-attribute')
      };
    }

  };

});
