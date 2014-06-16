define([
  'extensions/views/view',
  'common/views/visualisations/multi_stat_item/single_stat_item/headline',
  'common/views/visualisations/multi_stat_item/single_stat_item/delta',
  'stache!common/templates/visualisations/user-satisfaction'
],
function (View, HeadlineItemView, DeltaItemView, template) {
  var UserSatisfactionView = View.extend({

    template: template,

    initialize: function () {

      View.prototype.initialize.apply(this, arguments);

      var valueAttr = this.collection.options.valueAttr;
      var percentAttr = valueAttr + '_percent';

      this.stat = {
        'attr': percentAttr
      };

      if (this.collection.first()) {
        this.collection.first().get('values').each(function (d) {
          var val = d.get(valueAttr);
          var percent = this.getScoreAsPercentage(val);
          d.set(percentAttr, percent);
        }, this);
      }

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

  return UserSatisfactionView;

});
