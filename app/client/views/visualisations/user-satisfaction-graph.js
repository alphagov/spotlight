define([
  'client/views/visualisations/completion-rate',
  'client/views/visualisations/bar-chart/user-satisfaction',
  'common/views/visualisations/volumetrics/number',
  'extensions/collections/collection'
],
function (SingleTimeseriesView, UserSatisfactionView, VolumetricsNumberView, Collection) {
  return SingleTimeseriesView.extend({

    valueAttr: 'rating',

    formatOptions: {
      type: 'percent'
    },

    initialize: function () {
      this.userSatisfactionCollection = new Collection(this.getBreakdown(), { format: 'integer' });

      SingleTimeseriesView.prototype.initialize.apply(this, arguments);

      this.listenTo(this.collection, 'change:selected', this.onChangeSelected, this);
    },

    onChangeSelected: function (selectModel) {
      var ratings = this.getBreakdown(selectModel);
      this.userSatisfactionCollection.reset(ratings);
      this.populateBreakdownLabel(selectModel);
      this.populateResponses(selectModel);
    },

    render: function () {
      SingleTimeseriesView.prototype.render.apply(this, arguments);

      this.populateBreakdownLabel();

      this.populateResponses();
    },

    populateBreakdownLabel: function (selectModel) {
      if (this.model.get('parent').get('page-type') === 'module') {
        var output = '';

        if (selectModel) {
          output = VolumetricsNumberView.prototype.getLabel.call(this, selectModel) || 'no-data';
        }
        this.$el.find('.volumetrics-bar-period').html(output);
      }
    },

    populateResponses: function (selectModel) {
      var model = selectModel || this.collection.lastDefined('total:sum'),
          output = '';

      if (model) {
        if (model.get('total:sum')) {
          output = '(' + model.get('total:sum') + ' total responses)';
        } else {
          output = 'no-data';
        }
      }
      this.$el.find('.total-responses').html(output);
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
      var views = SingleTimeseriesView.prototype.views.apply(this, arguments);
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
