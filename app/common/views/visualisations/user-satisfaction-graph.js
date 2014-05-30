define([
  'stache!common/templates/visualisations/user-satisfaction-graph',
  'common/views/visualisations/completion_rate',
  'common/views/visualisations/bar-chart/user-satisfaction',
  'extensions/collections/collection'
],
function (template, CompletionRateView, UserSatisfactionView, Collection) {
  return CompletionRateView.extend({
    template: template,

    valueAttr: 'rating',

    initialize: function () {
      this.userSatisfactionCollection = new Collection([ { values: new Collection(this.getBreakdown()) } ], { format: 'integer' });

      CompletionRateView.prototype.initialize.apply(this, arguments);

      this.listenTo(this.collection, 'change:selected', this.onChangeSelected, this);
    },

    onChangeSelected: function (selectGroup, selectGroupIndex, selectModel) {
      var ratings = this.getBreakdown(selectModel);
      this.userSatisfactionCollection.at(0).get('values').reset(ratings);
    },

    getBreakdown: function (selectModel) {
      if (selectModel) {
        selectModel = _.isArray(selectModel) ? selectModel[0] : selectModel;
      }

      var ratings = [],
        attr, val, valueAttr;

      _.each([
        'Very dissatisfied',
        'Dissatisfied',
        'Neither satisfied or dissatisfied',
        'Satisfied',
        'Very satisfied'
      ], function (label, i) {
        attr = this.valueAttr + '_' + (i + 1) + ':sum';
        if (selectModel) {
          val = selectModel.get(attr);
          valueAttr = selectModel.get(valueAttr);
        } else {
          val = this.collection.sum(attr);
        }
        ratings.push({ count: val, title: label});
      }, this);

      return ratings;
    },

    views: function () {
      var views = CompletionRateView.prototype.views.apply(this, arguments);

      views['#volumetrics-bar-selected'] = {
        view: UserSatisfactionView,
        options: {
          valueAttr: 'count',
          selectionValueAttr: this.valueAttr,
          collection: this.userSatisfactionCollection
        }
      };

      return views;
    }
  });
});
