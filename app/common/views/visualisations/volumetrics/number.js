define([
  'extensions/views/single_stat'
],
function (SingleStatView) {
  var NumberView = SingleStatView.extend({

    changeOnSelected: true,
    labelPrefix: '',

    formatValue: function(value) {
      return this.formatNumericLabel(value);
    },

    getValue: function () {
      return this.formatValue(this.collection.at(0).get(this.valueAttr));
    },

    getLabel: function () {
      var periodLabel = this.model.get('period') || "week";
      var events = this.collection.at(0).get("weeks"),
          unavailableEvents = events.total - events.available,
          label = [
            this.labelPrefix,
            'last',
            events.total,
            this.pluralise(periodLabel, events.total)
          ];

      if (unavailableEvents > 0) {
        label = label.concat([
          "<span class='unavailable'>(" + unavailableEvents,
          this.pluralise(periodLabel, unavailableEvents),
          "unavailable)</span>"
        ]);
      }

      return label.join(' ');
    },

    getValueSelected: function (selection) {
      return this.formatValue(selection.selectedModel.get(this.selectionValueAttr));
    },

    getLabelSelected: function (selection) {
      return this.formatPeriod(selection.selectedModel, 'week');
    }
  });

  return NumberView;
});
