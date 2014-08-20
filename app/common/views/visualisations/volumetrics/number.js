define([
  'extensions/views/view'
],
function (View) {
  var NumberView = View.extend({

    changeOnSelected: true,
    labelPrefix: '',
    formatOptions: { type: 'number', magnitude: true, pad: true },
    valueTag: 'strong',

    initialize: function () {
      View.prototype.initialize.apply(this, arguments);

      if (this.changeOnSelected) {
        this.listenTo(this.collection, 'change:selected', this.onChangeSelected, this);
      }
      this.listenTo(this.collection, 'reset sync error', this.render, this);
    },

    onChangeSelected: function () {
      this.render();
    },

    render: function () {
      View.prototype.render.apply(this, arguments);

      var value, label;
      var selection = this.collection.getCurrentSelection();

      if (selection.selectedModel) {
        value = this.getValueSelected(selection);
        label = this.getLabelSelected(selection);
      } else {
        value = this.getValue();
        label = this.getLabel();
      }

      var content = '';
      if (label) {
        content = '<span class="summary">' + label + '</span>';
      }
      if (value === null) {
        content += '<span class="no-data">(no data)</span>';
      } else if (this.valueTag) {
        content += '<' + this.valueTag + '>' + value + '</' + this.valueTag + '>';
      } else {
        content += value;
      }

      this.$el.html(content);
      delete this.selectedModel;
    },

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
