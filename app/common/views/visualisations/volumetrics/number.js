define([
  'extensions/views/single_stat'
],
function (SingleStatView) {
  var NumberView = SingleStatView.extend({

    changeOnSelected: true,
    labelPrefix: '',

    formatValue: function (value) {
      return this.formatNumericLabel(value);
    },

    getValue: function () {
      return this.formatValue(this.collection.at(0).get(this.valueAttr));
    },

    getLabel: function () {
      var periodLabel = this.getPeriod();
      var events = this.collection.at(0).get('periods'),
        unavailableEvents = events.total - events.available,
        label = [
          this.labelPrefix,
          'last',
          events.total,
          this.pluralise(periodLabel, events.total)
        ];

      if (unavailableEvents > 0) {
        label = label.concat([
          '<span class="unavailable">(' + unavailableEvents,
          this.pluralise(periodLabel, unavailableEvents),
          'unavailable)</span>'
        ]);
      }

      return label.join(' ');
    },

    getValueSelected: function (selection) {
      var val;
      if (selection.selectedGroupIndex !== null) {
        val = selection.selectedModel.get(this.selectionValueAttr);
      } else {
        val = null;
      }
      return this.formatValue(val);
    },

    getLabelSelected: function (selection) {
      if (selection.selectedGroupIndex !== null) {
        return this.formatPeriod(selection.selectedModel, this.getPeriod());
      } else {
        return '';
      }
    },

    getPeriod: function () {
      return this.model.get('period') || 'week';
    }
  });

  return NumberView;
});
