define([
  'extensions/views/single_stat'
],
function (SingleStatView) {
  var MostRecentNumberView = SingleStatView.extend({

    changeOnSelected: true,

    getFirstNonNullValueInCollection: function () {
      var values = this.collection.first().get('values');
      values = values.last(values.length).reverse();
      var firstMatch = _.find(values, function (value) {
        return !_.isNull(value.get(this.valueAttr));
      }, this);
      return firstMatch;
    },

    getValue: function () {
      var firstMatch = this.getFirstNonNullValueInCollection();
      return firstMatch ? this.format(firstMatch.get(this.valueAttr), this.formatOptions) : this.format(null, this.formatOptions);
    },

    getLabel: function () {
      var firstMatch = this.getFirstNonNullValueInCollection();
      return firstMatch ? this.formatPeriod(firstMatch, this.getPeriod()) : '';
    },

    getValueSelected: function (selection) {
      var val;
      if (selection.selectedGroupIndex !== null) {
        val = selection.selectedModel.get(this.valueAttr);
      } else {
        val = null;
      }
      return this.format(val, this.formatOptions);
    },

    getLabelSelected: function (selection) {
      if (selection.selectedGroupIndex !== null) {
        return this.formatPeriod(selection.selectedModel, this.getPeriod());
      } else {
        return '';
      }
    },

    getPeriod: function () {
      return this.model.get('axis-period') || 'week';
    }
  });

  return MostRecentNumberView;
});
