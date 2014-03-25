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
        this.$table.removeClass('floated-header');
      } else {
        this.prepareTable();
      }
      this.renderHead();
      this.renderBody();

      if (isClient) {
        // When the table has rendered client-side call a method to set up the floating headers.
        // Ideally this would be the only part of the table module that runs client-side, but
        // the entire module has to at the moment.
        this.floatHeaders();
      }
    },

    renderHead: function () {
      var $thead = this.renderEl('thead', this.$table);
      var $row = this.renderEl('tr', $thead);

      _.each(this.getColumns(), function (column) {
        var label = column.label;

        if (column.timeshift) {
          label += ' (' + column.timeshift + ' ' + this.period + 's ago)';
        }

        this.renderEl('th', $row, label, { scope: 'col' });
      }, this);

    },

    renderBody: function () {
      var columns = this.getColumns();
      var keys = _.pluck(columns, 'key');
      var $tbody = this.renderEl('tbody', this.$table);

      if (this.sortBy) {
        this.collection.sortByAttr(this.sortBy, this.sortOrder === 'descending');
      }

      _.each(this.collection.getTableRows(keys), function (row) {
        var $row = this.renderEl('tr', $tbody);
        var renderCell = this.renderCell.bind(this, 'td', $row);

        _.each(row, function (cell, index) {
          renderCell(cell, columns[index]);
        });

      }, this);
    },

    renderCell: function (tag, parent, content, column) {
      var className = '';

      if (column.format) {
        content = this.format(content, column.format);
        className = _.isString(column.format) ? column.format : column.format.type;
      }

      content = (content === null || content === undefined) ? 'no data' : content;

      this.renderEl(tag, parent, content, {
        'class': className
      });
    },

    getColumns: function () {
      var cols = [],
        axes = this.collection.options.axes;
      if (axes) {
        cols = _.map(axes.y, function (axis) {
          if (!axis.key || !this.valueAttr || axis.key === this.valueAttr) {
            return _.extend({
              key: this.valueAttr
            }, axis);
          }
        }, this);
        if (axes.x) {
          cols.unshift(axes.x);
        }
      }
      return _.filter(cols);
    },

    floatHeaders: function () {
      var headers = this.$table.find('thead th');

      _.each(headers, function (th, index) {
        th.width = th.offsetWidth;
        this.$table.find('tbody td')[index].width = th.offsetWidth;
      }, this);

      this.$table.addClass('floated-header');
    }

  });

  _.extend(TableView.prototype, Formatters);

  return TableView;
});
