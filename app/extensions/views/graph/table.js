define([
  'extensions/views/table',
  'extensions/views/hideShow'
],
function (Table, HideShow) {
  return Table.extend({
    initialize: function () {
      if (this.collection.options.axes) {
        this.$toggleContainer = $('<div>', {'class': 'table-toggle'});

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
      if (this.collection.options.axes) {
        this.$table = $('<table/>');
        this.$table.appendTo(this.$toggleContainer);
        this.$toggleContainer.insertAfter(this.$el);
      }
    }
  });
});
