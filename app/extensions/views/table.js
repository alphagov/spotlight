define([
  './view'
],
function (View) {
  return View.extend({
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
          element.text(this.formatValueForTable(value));
        }
        if (attr) {
          element.attr(attr);
        }
        element.appendTo(context);
      }
      return element;
    },

    // TODO: This should live in a common formatter as this also lives in other places.
    // It should probably be controlled by some central config for formatting in the module setup json.
    formatValueForTable: function (value) {
      if (this.valueAttr === 'avgresponse' && typeof value === 'number') {
        return this.formatDuration(value, 's', 2);
      }
      if (this.valueAttr === 'uptimeFraction' || this.valueAttr === 'completion' && typeof value === 'number') {
        return this.formatPercentage(value);
      } else {
        return value;
      }
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
      var keys = _.pluck(this.getColumns(), 'key');
      var $tbody = this.renderEl('tbody', this.$table);
      _.each(this.collection.getTableRows(keys), function (row, rowIndex) {

        var $row = this.renderEl('tr', $tbody);
        var renderCell = this.renderCell.bind(this, 'td', $row);

        _.each(row, function (cell, index) {
          if (_.isArray(cell)) { // pulling data from multiple nested collections
            _.each(cell, function (datapoint, columnIndex) {
              // only render the first column for the first collection
              if (columnIndex > 0 || index === 0) { renderCell(datapoint); }
            });
          } else {
            renderCell(cell);
          }
        });

      }, this);
    },

    renderCell: function (tag, parent, content, attrs) {
      content = (content === null || content === undefined) ? 'no data' : content;
      this.renderEl(tag, parent, content, attrs);
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
});
