var requirejs = require('requirejs');

var SingleStatView = requirejs('extensions/views/single_stat');


module.exports = SingleStatView.extend({

  changeOnSelected: false,
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
    var model = this.collection.last();
    var change = this.getChange(model, this.valueAttr);
    this.trend = change.trend;
    return change.percentChange;
  },

  getLabel: function () {
    var model = this.collection.last();
    return this.getChange(model).previousDate;
  },

  getValueSelected: function () {
    return this.getValue();
  },

  getLabelSelected: function () {
    return this.getLabel();
  },

  getChange: function (model) {

    var attr = this.valueAttr;
    var previousValue = null, previousDate = null, trend = null, percentChange = null;
    var currentValue = model.get(attr);
    var currentDate = model.get(this.timeAttr);

    // Get previous value from collection.
    previousDate = currentDate.clone().subtract(this.deltaPeriod, this.delta);
    var matchingValues = this.collection.find(function (d) {
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