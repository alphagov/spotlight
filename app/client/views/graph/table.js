define([
  'client/views/table',
  'extensions/views/hideShow'
],
function (Table, HideShow) {
  return Table.extend({
    initialize: function () {

      this.isModule = (this.model.get('page-type') === 'module');

      Table.prototype.initialize.apply(this, arguments);
      this.stopListening(this.collection, 'reset add remove sync', this.render);
    },

    render: function () {
      if (this.isModule) {
        Table.prototype.render.apply(this, arguments);
        return;
      }

      this.$toggleContainer = this.$('.table-toggle');
      if (!this.$toggleContainer.length) {
        Table.prototype.render.apply(this, arguments);
        this.$toggleContainer = $('<div>', {'class': 'table-toggle'});
        this.$toggleContainer.appendTo(this.$el);
        var label = 'Table view of “' + this.model.get('title') + '” data';
        this.$table = this.$('table');
        this.$table.appendTo(this.$toggleContainer);
        this.toggleTable = new HideShow({
          $reveal: this.$table,
          $el: this.$toggleContainer,
          showLabel: label,
          hideLabel: label
        });
      }
    },

    remove: function () {
      if (this.toggleTable) {
        this.toggleTable.remove();
      }
      return Table.prototype.remove.apply(this, arguments);
    }
  });
});
