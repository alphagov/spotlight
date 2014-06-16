define([
  'extensions/views/single_stat'
],
function (SingleStatView) {
  var DeltaItemView = SingleStatView.extend({

    changeOnSelected: true,
    valueTag: 'p',

    initialize: function (options) {
      SingleStatView.prototype.initialize.apply(this, arguments);

      this.delta = options.delta || 12;
      this.deltaPeriod = options.deltaPeriod || 'months';
      this.timeAttr = options.timeAttr || '_start_at';
    },

    render: function () {
      SingleStatView.prototype.render.apply(this, arguments);
      this.$el.find('p:first').addClass('change impact-number');
      this.$el.find('p').removeClass('increase decrease no-change');
      this.$el.find('p').addClass(this.trend);
    },

    getValue: function () {
      if (this.collection.first()) {
        var model = this.collection.first().get('values').last();
        var change = this.getChange(model, this.stat.attr);
        this.trend = change.trend;
        return change.percentChange;
      } else {
        return null;
      }
    },

    getLabel: function () {
      if (this.collection.first()) {
        var model = this.collection.first().get('values').last();
        return this.getChange(model, this.stat.attr).previousDate;
      } else {
        return null;
      }
    },

    getValueSelected: function (selected) {
      var change = this.getChange(selected.selectedModel, this.stat.attr);
      this.trend = change.trend;
      return change.percentChange;
    },

    getLabelSelected: function (selected) {
      return this.getChange(selected.selectedModel, this.stat.attr).previousDate;
    },

    getChange: function (model, attr) {

      var previousValue = null, previousDate = null, trend = null, percentChange = null;
      var currentValue = model.get(attr);
      var currentDate = model.get(this.timeAttr);

      // Get previous value from collection.
      previousDate = currentDate.clone().subtract(this.deltaPeriod, this.delta);
      var matchingValues = this.collection.first().get('values').find(function (d) {
        return (d.get(this.timeAttr).valueOf() === previousDate.valueOf());
      }, this);

      if (typeof matchingValues !== 'undefined') {
        previousValue = matchingValues.get(attr);

        if (previousValue) {
          percentChange = this.format((currentValue - previousValue) / previousValue, {
            type: 'percent',
            dps: 2,
            pad: true,
            showSigns: true
          });
          if (percentChange === '0%') {
            percentChange = 'no change';
          }
        }

        if (percentChange !== 'no change') {
          if (currentValue > previousValue) {
            trend = 'increase';
            if (this.showColours) {
              trend += ' improvement';
            }
          } else if (currentValue < previousValue) {
            trend = 'decrease';
            if (this.showColours) {
              trend += ' decline';
            }
          }
        } else {
          trend = 'no-change';
        }
      }

      return {
        previousDate: previousDate.format('MMM YYYY'),
        percentChange: percentChange,
        trend: trend
      };
    }

  });

  return DeltaItemView;
});
