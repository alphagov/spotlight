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

    getValue: function (model) {
      model = model || this.collection.lastDefined(this.valueAttr);
      var val = model ? model.get(this.valueAttr) : null;
      return this.formatValue(val);
    },

    getLabel: function (model) {
      model = model || this.collection.lastDefined(this.valueAttr);
      if (model) {
        return this.formatPeriod(model, this.getPeriod());
      }
      return '';
    },

    getValueSelected: function (selection) {
      return this.getValue(selection.selectedModel);
    },

    getLabelSelected: function (selection) {
      return this.getLabel(selection.selectedModel);
    },

    getPeriod: function () {
      return this.collection.getPeriod() || 'week';
    }
  });

  return NumberView;
});
