define([
  'common/views/visualisations/completion_rate',
  'common/views/visualisations/bar-chart/user-satisfaction',
  'common/views/visualisations/volumetrics/number',
  'extensions/collections/collection'
],
function (CompletionRateView, UserSatisfactionView, VolumetricsNumberView, Collection) {
  return CompletionRateView.extend({

    valueAttr: 'rating',

    initialize: function () {
      this.userSatisfactionCollection = new Collection(this.getBreakdown(), { format: 'integer' });

      CompletionRateView.prototype.initialize.apply(this, arguments);

      this.listenTo(this.collection, 'change:selected', this.onChangeSelected, this);
    },

    onChangeSelected: function (selectModel) {
      var ratings = this.getBreakdown(selectModel);
      this.userSatisfactionCollection.reset(ratings);
      this.populateBreakdownLabel();
    },

    render: function () {
      CompletionRateView.prototype.render.apply(this, arguments);

      this.populateBreakdownLabel();
    },

    populateBreakdownLabel: function () {
      if (this.model.get('parent').get('page-type') === 'module') {
        var selection = this.collection.getCurrentSelection();

        if (selection.selectedModel) {
          selection = VolumetricsNumberView.prototype.getLabel.call(this, selection.selectedModel);
        } else {
          selection = VolumetricsNumberView.prototype.getLabel.call(this);
        }
        selection = selection === '' ? '(no data)' : selection;

        this.$el.find('.volumetrics-bar-period').html(selection);
      }
    },

    getPeriod: function () {
      return this.collection.getPeriod() || 'week';
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
          val = this.collection.total(attr);
        }
        ratings.push({ count: val, title: label});
      }, this);

      return ratings;
    },

    views: function () {
      var views = CompletionRateView.prototype.views.apply(this, arguments);
      if (this.model.get('parent').get('page-type') === 'module') {
        views['.volumetrics-bar-selected'] = {
          view: UserSatisfactionView,
          options: {
            valueAttr: 'count',
            collection: this.userSatisfactionCollection,
            formatOptions: this.formatOptions || 'integer'
          }
        };
      }

      return views;
    }
  });
});
