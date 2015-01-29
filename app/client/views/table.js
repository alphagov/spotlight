define([
  'extensions/views/table',
  'modernizr',
  'client/accessibility'
],
function (TableView, Modernizr, accessibility) {

  return TableView.extend({

    initialize: function (options) {

      TableView.prototype.initialize.apply(this, arguments);

      this.$table = this.$('table');

      this.options = _.extend({
        scrollable: true
      }, options || {});

      this.tableCollection = new this.collection.constructor(this.collection.models, this.collection.options);

      this.listenTo(this.tableCollection, 'sort', this.renderSort);
      this.sort();

      this.listenTo(this.tableCollection, 'reset', this.renderSort);

      this.listenTo(this.collection, 'sync reset', this.syncToTableCollection);

      this.listenTo(this.model, 'change:sort-by change:sort-order', function () { this.sort(); });

    },

    events: {
      'click th a': 'sortCol'
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
        headerContent,
        labelToReplace,
        newLabel;

      if (sortBy) {
        var ths = this.$('thead th'),
          th = this.$('thead th[data-key="' + sortBy + '"]'),
          link,
          linkInner;

        ths.removeClass('asc');
        ths.removeClass('desc');
        ths.removeAttr('aria-sort');

        if (sortOrder === 'descending') {
          th.addClass('desc');
          newLabel = 'ascending';
          labelToReplace = 'descending';
        } else {
          th.addClass('asc');
          newLabel = 'descending';
          labelToReplace = 'ascending';
        }

        th.attr('aria-sort', sortOrder);
        link = th.find('a');
        linkInner = link.find('.js-aria-live-inner');
        if (!linkInner.length) {
          linkInner = link;
        }
        if (link.length) {
          headerContent = linkInner.html().replace(labelToReplace, newLabel);
          accessibility.updateLiveRegion(link, headerContent);
        }

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

        if (firstVal) {
          firstVal = this.stripLink(firstVal);
        }
        if (secondVal) {
          secondVal = this.stripLink(secondVal);
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
          headerLinks = this.$table.find('thead th a'),
          body = this.$table.find('tbody td, tbody th');

      headers.attr('width', '');
      if (headerLinks.length === 0) {
        headers.each(function () {

          $(this).attr('role', 'columnheader');
          $(this).wrapInner('<a href="#" aria-live="assertive"></a>')
            .find('a')
            .append(' <span class="visuallyhidden">Click to change sort order to ascending</span>');
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

    }

  });

});