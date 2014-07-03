define([
  'extensions/views/table',
  'modernizr'
],
function (TableView, Modernizr) {

  return TableView.extend({

    initialize: function () {
      this.$table = this.$('table');

      this.tableCollection = new this.collection.constructor(this.collection.models, this.collection.options);

      this.listenTo(this.tableCollection, 'sort', this.renderSort);

      this.listenTo(this.collection, 'sync', this.syncToTableCollection);

      TableView.prototype.initialize.apply(this, arguments);
    },

    events: {
      'click th a': 'sortCol'
    },

    syncToTableCollection: function () {
      this.tableCollection.models = _.clone(this.collection.models);
    },

    renderSort: function () {
      if (this.$table.find('tbody')) {
        this.$table.find('tbody').remove();
      }
      $(this.renderBody(this.tableCollection)).appendTo(this.$table);
      this.render();
    },

    sortCol: function (e) {
      e.preventDefault();

      var th = $(e.target).parent(),
        ths = this.$table.find('th'),
        column = ths.index(th),
        isSorted = th.hasClass('desc') || th.hasClass('asc'),
        isDescending = isSorted && th.hasClass('desc') || false,
        columns = this.getColumns(),
        sortBy = columns[column].key;

      if (_.isArray(sortBy)) {
        sortBy = sortBy[0];
      }

      ths.removeClass('asc');
      ths.removeClass('desc');

      if (isDescending) {
        th.addClass('asc');
      } else {
        th.addClass('desc');
      }

      this.tableCollection.comparator = function (a, b) {
        var firstVal = a.get(sortBy),
          firstTime = a.get('_timestamp') || a.get('_start_at'),
          secondVal = b.get(sortBy),
          secondTime = b.get('_timestamp') || a.get('_end_at'),
          nullValues = (firstVal !== null || secondVal !== null),
          ret;

        if (nullValues && firstVal < secondVal) {
          ret = -1;
        } else if (nullValues && firstVal > secondVal) {
          ret = 1;
        } else {
          if (nullValues) {
            if (firstVal === null) {
              ret = -1;
            }
            if (secondVal === null) {
              ret = 1;
            }
          } else {
            if (firstTime < secondTime) {
              ret = -1;
            } else if (firstTime > secondTime) {
              ret = 1;
            } else {
              ret = 0;
            }
          }
        }

        if (!isDescending) {
          ret = -ret;
        }
        return ret;
      };

      this.tableCollection.sort();
    },

    render: function () {
      if (Modernizr.touch) {
        this.$('table').addClass('touch-table');
      }

      this.$('table').removeClass('floated-header');
      var headers = this.$('table').find('thead th'),
          body = this.$('table').find('tbody td');

      headers.attr('width', '');
      body.attr('width', '');

      if (body.length > headers.length) {
        _.each(headers, function (th, index) {
          th.width = th.offsetWidth;
          body[index].width = th.offsetWidth;
        }, this);
        this.$('table').addClass('floated-header');
      }

    }

  });

});