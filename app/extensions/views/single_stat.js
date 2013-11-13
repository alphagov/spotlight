define([
  'extensions/views/view'
],
function (View) {
  var SingleStatView = View.extend({

    changeOnSelected: false,
    valueTag: 'strong',

    initialize: function () {
      View.prototype.initialize.apply(this, arguments);

      var events = 'reset';
      if (this.changeOnSelected) {
        events += ' change:selected';
      }
      this.collection.on(events, this.render, this);
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

      var content = null;
      if (value === null) {
        content = "<span class='no-data'>(no data)</span>";
      } else if (this.valueTag) {
        content = '<' + this.valueTag + '>' + value + '</' + this.valueTag + '>';
      } else {
        content = value;
      }

      if (label) {
        content += ' ' + label;
      }
      this.$el.html(content);
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
