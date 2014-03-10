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
      this.axes = collection.options.axes;

      View.prototype.initialize.apply(this, arguments);

      collection.on('reset add remove sync', this.render, this);
    },

    prepareTable: function () {
      this.$table = $('<table></table>');
      this.$table.appendTo(this.$el);
    },

    renderEl: function (elementName, context, value, attr) {
      var element;
      if (context) {
        element = $('<' + elementName + '></' + elementName + '>');
        if (value && value !== null || value !== undefined) {
          element.text(value);
        }
        if (attr) {
          element.attr(attr);
        }
        element.appendTo(context);
      }
      return element;
    },

    render: function () {
      if (this.$table) {
        this.$table.empty();
      } else {
        this.prepareTable();
      }
      this.renderHead();
      this.renderBody();
    },

    renderHead: function () {
      var $thead = this.renderEl('thead', this.$table);
      var $row = this.renderEl('tr', $thead);

      _.each(this.getColumns(), function (column) {
        this.renderEl('th', $row, column.label, { scope: 'col' });
      }, this);

    },

    renderBody: function () {
      var columns = this.getColumns();
      var keys = _.pluck(columns, 'key');
      var $tbody = this.renderEl('tbody', this.$table);
      _.each(this.collection.getTableRows(keys), function (row) {
        var $row = this.renderEl('tr', $tbody);
        var renderCell = this.renderCell.bind(this, 'td', $row);

        _.each(row, function (cell, index) {
          if (_.isArray(cell)) { // pulling data from multiple nested collections
            _.each(cell, function (datapoint, columnIndex) {
              // only render the first column for the first collection
              if (columnIndex > 0 || index === 0) {
                renderCell(datapoint, columns[index + columnIndex]);
              }
            });
          } else {
            renderCell(cell, columns[index]);
          }
        });

      }, this);
    },

    renderCell: function (tag, parent, content, column) {
      if (column.format) {
        content = this.format(content, column.format);
      }
      content = (content === null || content === undefined) ? 'no data' : content;
      this.renderEl(tag, parent, content);
    },

    getColumns: function () {
      var cols = [];
      if (this.axes) {
        cols = _.map(this.axes.y, function (axis) {
          if (!axis.key || axis.key === this.valueAttr) {
            return _.extend({
              key: this.valueAttr
            }, axis);
          }
        }, this);
        if (this.axes.x) {
          cols.unshift(this.axes.x);
        }
      }
      return _.filter(cols);
    }

  });

  _.extend(TableView.prototype, Formatters);

  return TableView;
});
