var requirejs = require('requirejs');
var path = require('path');

var View = requirejs('extensions/views/view');
var HeadlineItemView = requirejs('common/views/visualisations/headline');
var DeltaItemView = requirejs('common/views/visualisations/delta');
var templatePath = path.resolve(__dirname, '../../templates/modules/user-satisfaction.html');
var templater = require('../../mixins/templater');

module.exports = View.extend(templater).extend({

  templatePath: templatePath,

  templateType: 'mustache',

  initialize: function () {

    View.prototype.initialize.apply(this, arguments);

    var valueAttr = this.collection.options.valueAttr;
    var percentAttr = valueAttr + '_percent';

    this.stat = {
      'attr': percentAttr
    };

    this.collection.each(function (d) {
      var val = d.get(valueAttr);
      var percent = this.getScoreAsPercentage(val);
      d.set(percentAttr, percent);
    }, this);

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
            stat: this.stat,
            valueAttr: this.stat.attr,
            timeAttr: '_timestamp',
            isPercent: true
          };
        }
      },
      '.single-stat-delta': {
        view: DeltaItemView,
        options: function () {
          return {
            stat: this.stat,
            collection: this.collection,
            valueAttr: this.stat.attr,
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
