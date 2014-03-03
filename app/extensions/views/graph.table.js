define([
  './table',
  './hideShow'
],
function (Table, HideShow) {
  return Table.extend({
    initialize: function () {
      if (this.collection.options.axisLabels) {
        this.$toggleContainer = $('<div></div>');

        Table.prototype.initialize.apply(this, arguments);

        this.toggleTable = new HideShow({
          $reveal: this.$table,
          $el: this.$toggleContainer,
          showLabel: 'Show the data for this graph.',
          hideLabel: 'Hide the data for this graph.'
        });
      }
    },
    prepareTable: function () {
      this.$table.appendTo(this.$toggleContainer);
      this.$toggleContainer.appendTo(this.$el);
    },
  });
});