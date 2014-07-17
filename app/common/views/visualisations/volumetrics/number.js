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
      return this.formatValue(this.collection.lastDefined(this.valueAttr).get(this.valueAttr));
    },

    getLabel: function () {
      var period = this.getPeriod();
      var available = this.collection.defined(this.valueAttr).length;
      var label;
      if (available === 0) {
        label = '(no data)';
      } else {
        var unavailableEvents = this.collection.length - available;
        label = [
          this.labelPrefix,
          'last',
          this.collection.length,
          this.format(this.collection.length, { type: 'plural', singular: period })
        ];
        if (unavailableEvents > 0) {
          label = label.concat([
            '<span class="unavailable">(' + unavailableEvents,
            this.format(unavailableEvents, { type: 'plural', singular: period }),
            'unavailable)</span>'
          ]);
        }
        label = label.join(' ');
      }
      return label;
    },

    getValueSelected: function (selection) {
      var val;
      if (selection.selectedModel !== null) {
        val = selection.selectedModel.get(this.valueAttr);
      } else {
        val = null;
      }
      return this.formatValue(val);
    },

    getLabelSelected: function (selection) {
      if (selection.selectedModel !== null) {
        return this.formatPeriod(selection.selectedModel, this.getPeriod());
      } else {
        return '';
      }
    },

    getPeriod: function () {
      return this.collection.getPeriod() || 'week';
    }
  });

  return NumberView;
});
