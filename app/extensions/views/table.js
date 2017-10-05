define([
  './view',
  'extensions/mixins/formatters'
],
function (View, Formatters) {

  var TableView = View.extend({
    initialize: function (options) {

      this.options = options || {};
      var existingCollection = this.options.collection || this.collection;

      this.collection = new existingCollection.constructor(existingCollection.toJSON(), existingCollection.options);


      this.valueAttr = this.options.valueAttr;
      this.period = this.collection.getPeriod();

      View.prototype.initialize.apply(this, arguments);

      this.listenTo(this.collection, 'reset add remove', this.render);
      this.initSort();
    },

    initSort: function() {
      if (this.model) {
        this.listenTo(this.model, 'change:sort-by change:sort-order', _.bind(function() {
          this.sort();
        }, this));

        if (this.model.get('params')) {
          if (this.model.get('params').sortby) {
            this.model.set('sort-by', this.model.get('params').sortby, {silent: true});
          }
          if (this.model.get('params').sortorder) {
            this.model.set('sort-order', this.model.get('params').sortorder, {silent: true});
          }
          this.sort();
        }
      }
    },

    prepareTable: function () {
      var cls = '',
        caption;

      this.$('table').remove();
      cls += (this.options.collapseOnNarrowViewport === true) ? ' table-collapsible' : '';
      cls += (this.options.hideHeader === true) ? ' table-no-header' : '';
      caption = (this.options.caption) ? '<caption class="visuallyhidden">' + this.options.caption + '</caption>' : '';
      this.$el.append('<table class="' + cls + '">' + caption + '</table>');
      this.$table = this.$('table');
    },

    render: function () {
      this.prepareTable();
      this.$table.append(this.renderHead());
      this.$table.append(this.renderBody());
    },

    renderHead: function () {
      var head = '',
        cls,
        sortOrder = this.model && this.model.get('sort-order'),
        sortUrlParam,
        sortBy = this.model && this.model.get('sort-by'),
        sortOrderAttr,
        headCls,
        clickLabel;

      head += _.map(this.getColumns(), function (column) {
        var label = column.label;
        var key = column.key;
        if (column.timeshift) {
          label += ' (' + column.timeshift + ' ' + this.period + 's ago)';
        }
        if (_.isArray(column.key)) {
          key = column.key[0];
        }
        if ((sortOrder === 'ascending') || (sortBy !== key)) {
          sortUrlParam = 'descending';
        } else {
          sortUrlParam = 'ascending';
        }
        if (sortBy === key) {
          cls = sortOrder + ' sort-column ';
          clickLabel = '';
          sortOrderAttr = sortOrder;
        } else {
          cls = '';
          clickLabel = ' <span class="js-click-sort visuallyhidden">Click to sort</span>';
          sortOrderAttr = '';
        }

        if (column.format) {
          cls += _.isString(column.format) ? column.format : column.format.type;
        }
        return '<th scope="col" data-key="' + key + '" class="' + cls + '" aria-sort="' + sortOrderAttr + '" role="columnheader"><a class="js-sort" href="?sortby=' + key + '&sortorder=' + sortUrlParam + '" role="button">' + label + clickLabel + '</a></th>';
      }, this).join('\n');
      headCls = (this.options.hideHeader) ? 'visuallyhidden' : '';
      return '<thead class="' + headCls + '"><tr>' + head + '</tr></thead>';
    },

    renderRow: function (obj, cellContent, index) {
      var columns = obj.columns,
        column = columns[index],
        key = column.key,
        className = '',
        sortColClass = '',
        attrs = '',
        tag = 'td';

      if (_.isArray(column.key)) {
        key = column.key[0];
      }
      if (this.model && this.model.get('sort-by') === key) {
        sortColClass = ' sort-column';
      }

      if (column.format) {
        cellContent = this.format(cellContent, column.format);
        className = _.isString(column.format) ? column.format : column.format.type;
      }

      cellContent = (cellContent === null || cellContent === undefined) ?
          '<abbr title="No data provided">—</abbr>' : cellContent;
      if (index === 0) {
        if (this.options.firstColumnIsHeading === true) {
          attrs = ' data-title="' + obj.rowIndex + '" scope="row"';
          tag = 'th';
        }
      } else {
        attrs = ' data-title="' + column.label + ': "';
      }

      className = ' class="' + className + sortColClass + '"';
      return '<' + tag + attrs + className + ' data-key="' + key + '">' + cellContent + '</' + tag + '>';
    },

    renderBody: function (collection) {
      collection = collection || this.collection;
      var param = {
            columns: this.getColumns(),
            rowIndex: 1
          },
          keys = _.pluck(param.columns, 'key'),
          rows = collection.getTableRows(keys, this.options.rowLimit),
          body = '';

      if (rows.length > 0) {
        body += _.map(rows, function (row) {
          var rowContent =
            _.map(row, this.renderRow.bind(this, param)).join('\n');

          param.rowIndex++;
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
          /*
            As the x-axis can be either a single object or a list of columns
            we need to determine whether the x-axis is an array.
            There are multiple ways to determine whether an object is an array
            in javascript:
            1. Check if the constructor is of type Array:
              axes.x.constructor === Array
            2. Check if the x axis object is an array:
              Array.isArray(axes.x)
            3. Check if the x axis is an instance of array:
              axes.x instanceof Array

            However, none of these work consistently. Whilst the web site can
            detect an array if any of these methods are used, the unit and
            integration tests do not. The cheapseats tests only work with
            options 1 and 3, and the unit tests only work with option 2.

            Used the code from http://javascript.crockford.com/remedial.html to
            determine whether or not an object is an array. (see the section on
            overloading the typeOf function)
          */
          if (Object.prototype.toString.call(axes.x) == '[object Array]'){
            _.each(axes.x, function(element){ cols.unshift(element);});
          }
          else {
            cols.unshift(axes.x);
          }
          this.options.firstColumnIsHeading = true;
        }
      }
      return _.filter(cols);
    },

    sort: function (sortBy, sortOrder) {

      sortBy = sortBy || this.model.get('sort-by');
      sortOrder = sortOrder || this.model.get('sort-order') || 'descending';

      if (!sortBy) {
        return;
      }

      this.collection.comparator = _.bind(function (a, b) {
        var firstVal = a.get(sortBy),
          firstTime = a.get('_timestamp') || a.get('_start_at'),
          secondVal = b.get(sortBy),
          secondTime = b.get('_timestamp') || b.get('_start_at'),
          nullValues = (firstVal === null && secondVal === null),
          ret = 0;

        if (firstVal && typeof firstVal === 'string') {
          firstVal = this.stripLink(firstVal).toLowerCase();
        }
        if (secondVal && typeof secondVal === 'string') {
          secondVal = this.stripLink(secondVal).toLowerCase();
        }

        if (nullValues) {
          if (firstTime < secondTime) {
            ret = -1;
          } else if (firstTime > secondTime) {
            ret = 1;
          }
          if (sortOrder === 'descending') {
            ret = -ret;
          }
        } else {
          if (firstVal === null) {
            ret = 1;
          } else if (secondVal === null) {
            ret = -1;
          } else {
            if (firstVal < secondVal) {
              ret = -1;
            } else if (firstVal > secondVal) {
              ret = 1;
            }
            if (sortOrder === 'descending') {
              ret = -ret;
            }
          }

        }

        return ret;
      }, this);

      this.collection.sort();
    },

    stripLink: function (str) {
      var $link = $('<div>' + str + '</div>').find('a');
      if ($link.length) {
        return $link.html();
      }
      return str;
    },

    mergeSortParams: function(queryString, sortBy, sortOrder) {
      var params = $.deparam(queryString);
      if (sortBy) {
        params.sortby = sortBy;
      }
      if (sortOrder) {
        params.sortorder = sortOrder;
      }

      return $.param(params);
    }

  });

  _.extend(TableView.prototype, Formatters);

  return TableView;
});
