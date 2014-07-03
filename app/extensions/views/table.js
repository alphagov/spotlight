define([
  './view',
  'extensions/mixins/formatters'
],
function (View, Formatters) {

  var TableView = View.extend({
    initialize: function (options) {
      options = options || {};
      var collection = this.collection = options.collection;

      this.valueAttr = options.valueAttr;
      this.period = collection.options.period;

      View.prototype.initialize.apply(this, arguments);

      this.listenTo(collection, 'reset add remove sync', this.render);
    },

    prepareTable: function () {
      this.$table = $('<table></table>');
      this.$table.appendTo(this.$el);
    },

    render: function () {
      if (this.$table) {
        this.$table.empty();
        this.$table.removeClass('floated-header');
      } else {
        this.prepareTable();
      }

      if (this.sortBy) {
        this.collection.sortByAttr(this.sortBy, this.sortOrder === 'descending');
      }

      $(this.renderHead()).appendTo(this.$table);
      $(this.renderBody()).appendTo(this.$table);
    },

    renderHead: function () {
      var head = '';
      head += _.map(this.getColumns(), function (column) {
        var label = column.label;
        if (column.timeshift) {
          label += ' (' + column.timeshift + ' ' + this.period + 's ago)';
        }
        return '<th scope="col"><a href="#">' + label + '</a></th>';
      }, this).join('\n');
      return '<thead><tr>' + head + '</tr></thead>';
    },

    renderRow: function (columns, cellContent, index) {
      var column = columns[index],
          className = '';

      if (column.format) {
        cellContent = this.format(cellContent, column.format);
        className = _.isString(column.format) ? column.format : column.format.type;
      }

      cellContent = (cellContent === null || cellContent === undefined) ?
          'no data' : cellContent;

      return '<td class="' + className + '">' + cellContent + '</td>';
    },

    renderBody: function (collection) {
      var collection = collection || this.collection,
          columns = this.getColumns(),
          keys = _.pluck(columns, 'key'),
          rows = collection.getTableRows(keys),
          body = '';

      if (rows.length > 0) {
        body += _.map(rows, function (row) {
          var rowContent =
            _.map(row, this.renderRow.bind(this, columns)).join('\n');

          return '<tr>' + rowContent + '</tr>';
        }, this).join('\n');
      } else {
        body += '<tr><td colspan="' + keys.length + '">No data available</td></tr>';
      }

      return '<tbody>' + body + '</tbody>';
    },

    getColumns: function () {
      var cols = [],
        axes = this.collection.options.axes;
      if (axes) {
        cols = _.map(axes.y, function (axis) {
          var column = _.extend({
            key: axis.key || (axis.groupId + ':' + this.valueAttr)
          }, axis);
          if (this.collection.options.isOneHundredPercent) {
            column.key += ':percent';
          }
          if (axis.timeshift) {
            column.key = 'timeshift' + axis.timeshift + ':' + column.key;
          }
          return column;
        }, this);
        if (axes.x) {
          cols.unshift(axes.x);
        }
      }
      return _.filter(cols);
    }

  });

  _.extend(TableView.prototype, Formatters);

  return TableView;
});
