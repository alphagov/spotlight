define([
  'extensions/views/single_stat'
],
function (SingleStatView) {
  var NumberView = SingleStatView.extend({

    changeOnSelected: true,
    labelPrefix: '',
    formatOptions: { type: 'number', magnitude: true, pad: true },

    formatValue: function (value) {
      return this.format(value, this.formatOptions);
    },

    getValue: function () {
      if (this.collection.at(0)) {
        return this.formatValue(this.collection.at(0).get(this.valueAttr));
      } else {
        return null;
      }
    },

    getLabel: function () {
      var period = this.getPeriod(),
          events, unavailableEvents, label;

      if (this.collection.at(0)) {
        events = this.collection.at(0).get('periods');
        unavailableEvents = events.total - events.available;
        label = [
          this.labelPrefix,
          'last',
          events.total,
          this.format(events.total, { type: 'plural', singular: period })
        ];

        if (unavailableEvents > 0) {
          label = label.concat([
            '<span class="unavailable">(' + unavailableEvents,
            this.format(unavailableEvents, { type: 'plural', singular: period }),
            'unavailable)</span>'
          ]);
        }
        return label.join(' ');
      } else {
        return '(no data)';
      }
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
