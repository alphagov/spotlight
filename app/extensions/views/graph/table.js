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

      }
    },

    prepareTable: function () {
      if (this.collection.options.axes) {
        this.$table = $('<table/>');
        this.$table.appendTo(this.$toggleContainer);
        this.$toggleContainer.insertAfter(this.$el);
        this.toggleTable = new HideShow({
          $reveal: this.$table,
          $el: this.$toggleContainer,
          showLabel: 'Show the data for this graph.',
          hideLabel: 'Hide the data for this graph.'
        });
      }
    },

    // Show the hidden tables before calling floatHeaders, as it relies on their
    // visible width on the page. Hide them again immediately after.
    floatHeaders: function () {
      this.toggleTable.show();
      Table.prototype.floatHeaders.apply(this, arguments);
      this.toggleTable.hide();
    }
  });
});
