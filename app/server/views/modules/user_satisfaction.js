var requirejs = require('requirejs');

var View = requirejs('extensions/views/view');
var HeadlineItemView = requirejs('common/views/visualisations/most-recent-number');
var template = requirejs('stache!common/templates/visualisations/user-satisfaction');

var DeltaItemView = require('../components/delta');

module.exports = View.extend({

  template: template,

  initialize: function () {

    View.prototype.initialize.apply(this, arguments);

    var valueAttr = this.collection.options.valueAttr;
    var percentAttr = valueAttr + '_percent';

    this.collection.each(function (d) {
      var val = d.get(valueAttr);
      var percent = this.getScoreAsPercentage(val);
      d.set(percentAttr, percent);
    }, this);

    this.valueAttr = percentAttr;

  },

  getScoreAsPercentage: function (score) {
    var maxScore = 5, minScore = 1;
    return (maxScore - score) / (maxScore - minScore);
  },


  views: function () {
    return {
      '.single-stat-headline': {
        view: HeadlineItemView,
        options: function () {
          return {
            valueAttr: this.valueAttr,
            formatOptions: 'percent'
          };
        }
      },
      '.single-stat-delta': {
        view: DeltaItemView,
        options: function () {
          return {
            valueAttr: this.valueAttr,
            timeAttr: '_timestamp',
            delta: 1,
            deltaPeriod: 'months',
            showColours: true
          };
        }
      }
    };

  }

});
