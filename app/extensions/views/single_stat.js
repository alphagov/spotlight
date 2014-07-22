define([
  'extensions/views/view'
],
function (View) {
  var SingleStatView = View.extend({

    changeOnSelected: false,
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

    getLabel: function () {
      return '';
    },

    getLabelSelected: function () {
      return '';
    }
  });

  return SingleStatView;
});
