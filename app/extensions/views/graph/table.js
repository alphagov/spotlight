define([
  'extensions/views/table'
],
function (Table) {
  return Table.extend({
    initialize: function () {
      this.isModule = (this.model.get('page-type') === 'module');

      Table.prototype.initialize.apply(this, arguments);
      this.stopListening(this.collection, 'reset add remove sync', this.render);
    },

    prepareTable: function () {
      this.$table = $('<table/>');

      if (!this.isModule) {
        this.$table.addClass('visuallyhidden');
      }

      this.$table.appendTo(this.$el);
    },

    floatHeaders: function () {
      // Only float the headers on the page-per-thing page. The dashboard table
      // is used for accessibility so doesn't need floated headers.
      if (this.isModule) {
        Table.prototype.floatHeaders.apply(this, arguments);
      }
    },

    remove: function () {
      return Table.prototype.remove.apply(this, arguments);
    }
  });
});
