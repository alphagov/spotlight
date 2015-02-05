define([
  'extensions/views/table',
  'modernizr',
  'client/accessibility',
    'jquerydeparam'
],
function (TableView, Modernizr, accessibility, $) {

  return TableView.extend({

    initialize: function (options) {

      TableView.prototype.initialize.apply(this, arguments);

      this.$table = this.$('table');

      this.options = _.extend({
        scrollable: true
      }, options || {});

      this.tableCollection = new this.collection.constructor(this.collection.models, this.collection.options);

      this.sortFields = _.cloneDeep(this.collection.options.axes.y);
      this.sortFields.unshift(this.collection.options.axes.x);
      this.sortFields = _.object(_.pluck(this.sortFields, 'key'), this.sortFields);

      this.listenTo(this.tableCollection, 'sort', this.renderSort);
      this.sort();

      this.listenTo(this.tableCollection, 'reset', _.bind(function() {
        accessibility.updateLiveRegion(this.tableCollection.length + ' transactions in list');
        this.renderSort();
      }, this));

      this.listenTo(this.collection, 'sync reset', this.syncToTableCollection);

      this.listenTo(this.model, 'change:sort-by change:sort-order', function () { this.sort(); });
      this.listenTo(this.model, 'sort-changed-external', _.bind(function(data) {
        this.screenreaderAnnounceSortChange(data['sort-by'], data['sort-order']);
        this.updateUrlWithSort();
      }, this));

    },

    events: {
      'click .js-sort': 'sortCol'
    },

    syncToTableCollection: function () {
      this.tableCollection.reset(this.collection.toJSON());
    },

    renderSort: function () {
      if (this.$table.find('tbody')) {
        this.$table.find('tbody').remove();
      }
      $(this.renderBody(this.tableCollection)).appendTo(this.$table);

      var sortBy = this.model.get('sort-by'),
        sortOrder = this.model.get('sort-order'),
        $sortedCells;

      if (sortBy) {
        var ths = this.$('thead th'),
          $allCells = this.$('th,td'),
          th = this.$('thead th[data-key="' + sortBy + '"]');

        ths.removeClass('asc');
        ths.removeClass('desc');
        ths.removeAttr('aria-sort');

        if (sortOrder === 'descending') {
          th.addClass('desc');
          th.attr('aria-sort', 'descending');
        } else {
          th.addClass('asc');
          th.attr('aria-sort', 'ascending');
        }

        $allCells.removeClass('sort-column');
        $sortedCells = this.$('[data-key="' + this.model.get('sort-by') + '"]');
        $sortedCells.addClass('sort-column');
      }

      this.render();
    },

    sortCol: function (e) {
      e.preventDefault();

      var th = $(e.target).closest('th'),
        sorted = this.model.get('sort-by'),
        isDescending = this.model.get('sort-order') === 'descending',
        sortBy = th.attr('data-key');

      if (_.isArray(sortBy)) {
        sortBy = sortBy[0];
      }

      if (sorted === sortBy) {
        this.model.set('sort-order', isDescending ? 'ascending' : 'descending');
      } else {
        this.model.set({
          'sort-order': 'descending',
          'sort-by': sortBy
        });
      }
      this.screenreaderAnnounceSortChange(sortBy, this.model.get('sort-order'));
      this.updateUrlWithSort();
    },

    sort: function (sortBy, sortOrder) {

      sortBy = sortBy || this.model.get('sort-by');
      sortOrder = sortOrder || this.model.get('sort-order') || 'descending';

      if (!sortBy) {
        return;
      }

      this.tableCollection.comparator = _.bind(function (a, b) {
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

      this.tableCollection.sort();
    },

    stripLink: function (str) {
      var $link = $(str).filter('a');
      if ($link.length) {
        return $link.html();
      }
      return str;
    },

    render: function () {
      if (Modernizr.touch) {
        this.$table.addClass('touch-table');
      }

      this.$table.removeClass('floated-header');
      var headers = this.$table.find('thead th'),
          headerLinks = this.$table.find('.js-sort'),
          body = this.$table.find('tbody td, tbody th');

      headers.attr('width', '');
      if (headerLinks.length === 0) {
        headers.each(function () {

          $(this).attr('role', 'columnheader');
          $(this).wrapInner('<a class="js-sort" href="#" role="button"></a>')
            .find('a')
            .append('<span class="visuallyhidden">Click to sort</span>');
        });
      }
      body.attr('width', '');

      if (this.options.scrollable && (body.length > headers.length)) {
        _.each(headers, function (th, index) {
          body[index].width = body[index].offsetWidth;
        }, this);

        this.$('table').addClass('floated-header');

        _.each(headers, function (th, index) {
          th.width = body[index].offsetWidth;
        }, this);
      }

    },

    screenreaderAnnounceSortChange: function(sortField, sortDirection) {
      var sortLabel = this.sortFields[sortField] && this.sortFields[sortField].label;
      if (sortLabel) {
        accessibility.updateLiveRegion('Transactions now sorted by ' + sortLabel + ' in ' + sortDirection + ' order');
      }
    },

    updateUrlWithSort: function() {
      if (Modernizr.history) {
        var params = $.deparam(window.location.search.substr(1));

        if (this.model.get('sort-by')) {
          params.sortby = this.model.get('sort-by');
        }
        if (this.model.get('sort-order')) {
          params.sortorder = this.model.get('sort-order');
        }

        params = $.param(params);
        this.replaceUrlParams(params);
      }
    },

    replaceUrlParams: function(params) {
      window.history.replaceState(null, null, '?' + params);
    }

  });

});