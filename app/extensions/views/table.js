define([
  './view',
  'extensions/mixins/formatters'
],
function (View, Formatters) {

  var TableView = View.extend({
    initialize: function (options) {
      this.options = options || {};
      var collection = this.collection = this.options.collection;

      this.valueAttr = this.options.valueAttr;
      this.period = collection.getPeriod();

      View.prototype.initialize.apply(this, arguments);

      this.listenTo(collection, 'reset add remove', this.render);
    },

    prepareTable: function () {
      var cls,
        caption;

      cls = (this.options.collapseOnNarrowViewport === true) ? ' class="table-collapsible"' : '';
      caption = (this.options.caption) ? '<caption class="visuallyhidden">' + this.options.caption + '</caption>' : '';
      this.$table = $('<table' + cls + '>' + caption + '</table>');
      this.$table.appendTo(this.$el);
    },

    render: function () {
      if (this.$table) {
        this.$table.find('thead,tbody').remove();
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
        var key = column.key;
        if (column.timeshift) {
          label += ' (' + column.timeshift + ' ' + this.period + 's ago)';
        }
        if (_.isArray(column.key)) {
          key = column.key[0];
        }
        return '<th scope="col" data-key="' + key + '">' + label + '</th>';
      }, this).join('\n');
      return '<thead><tr>' + head + '</tr></thead>';
    },

    renderRow: function (columns, cellContent, index) {
      var column = columns[index],
          className = '',
          attrs = '',
          tag = 'td';

      if (column.format) {
        cellContent = this.format(cellContent, column.format);
        className = _.isString(column.format) ? column.format : column.format.type;
        className = ' class="' + className + '"';
      }

      cellContent = (cellContent === null || cellContent === undefined) ?
          '<abbr title="No data provided">—</abbr>' : cellContent;
      if (index === 0) {
        if (this.options.firstColumnIsHeading === true) {
          attrs = ' scope="row"';
          tag = 'th';
        }
      } else {
        attrs = ' data-title="' + column.label + ': "';
      }

      return '<' + tag + className + attrs + ' data-key="' + column.key + '">' + cellContent + '</' + tag + '>';
    },

    renderBody: function (collection) {
      collection = collection || this.collection;
      var columns = this.getColumns(),
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
          this.options.firstColumnIsHeading = true;
        }
      }
      return _.filter(cols);
    }

  });

  _.extend(TableView.prototype, Formatters);

  return TableView;
});
