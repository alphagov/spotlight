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
        this.collection.on('change:selected', this.onChangeSelected, this);
      }
      this.collection.on('reset sync error', this.render, this);
    },

    onChangeSelected: function (selectGroup, selectGroupIndex, selectModel) {
      if (selectModel) {
        this.selectedModel = _.isArray(selectModel) ? selectModel[0] : selectModel;
      }
      this.render();
    },

    render: function () {
      View.prototype.render.apply(this, arguments);

      var value, label;
      var selection = this.collection.getCurrentSelection();

      if (this.selectedModel) {
        selection.selectedModel = this.selectedModel;
      }

      if (selection.selectedModel) {
        value = this.getValueSelected(selection);
        label = this.getLabelSelected(selection);
      } else {
        value = this.getValue();
        label = this.getLabel();
      }

      var content = null;
      if (value === null) {
        content = '<span class="no-data">(no data)</span>';
      } else if (this.valueTag) {
        content = '<' + this.valueTag + '>' + value + '</' + this.valueTag + '>';
      } else {
        content = value;
      }

      if (label) {
        content += ' ' + label;
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
