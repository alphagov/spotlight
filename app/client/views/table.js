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

      this.options = _.extend({
        scrollable: true,
        saveSortInUrl: false
      }, options || {});

      this.sortFields = this.collection.options.axes.y ?
        _.cloneDeep(this.collection.options.axes.y) : [];
      if (this.collection.options.axes.x) {
        this.sortFields.unshift(this.collection.options.axes.x);
      }

      this.sortFields = _.object(_.pluck(this.sortFields, 'key'), this.sortFields);

      this.listenTo(this.collection, 'sort', this.render);

      this.listenTo(this.collection, 'reset', _.bind(function() {
        accessibility.updateLiveRegion(this.collection.length + ' transactions in list');
        this.render();
      }, this));

      this.listenTo(this.model, 'change:sort-by change:sort-order', function () { this.sort(); });
      this.listenTo(this.model, 'sort-changed-external', _.bind(function(data) {
        this.screenreaderAnnounceSortChange(data['sort-by'], data['sort-order']);
        this.options.saveSortInUrl && this.updateUrlWithSort();
      }, this));

    },

    events: {
      'click .js-sort': 'sortCol'
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
      this.options.saveSortInUrl && this.updateUrlWithSort();
    },

    render: function () {

      TableView.prototype.render.apply(this, arguments);

      if (Modernizr.touch) {
        this.$('table').addClass('touch-table');
      }
      this.adjustCellWidths();

    },

    adjustCellWidths: function() {
      var $bodyCells = this.$('table').find('tbody td, tbody th'),
        $headerCells = this.$('table').find('thead th');
      $headerCells.attr('width', '');
      $bodyCells.attr('width', '');

      this.$('table').removeClass('floated-header');

      if (this.options.scrollable && ($bodyCells.length > $headerCells.length)) {
        _.each($headerCells, function (th, index) {
          $bodyCells[index].width = $bodyCells[index].offsetWidth;
        }, this);

        this.$('table').addClass('floated-header');

        _.each($headerCells, function (th, index) {
          th.width = $bodyCells[index].offsetWidth;
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
      var merged;
      if (Modernizr.history) {
        merged = this.mergeSortParams(window.location.search.substr(1), this.model.get('sort-by'),
          this.model.get('sort-order'));
        this.replaceUrlParams(merged);
      }
    },

    replaceUrlParams: function(params) {
      window.history.replaceState(null, null, '?' + params);
    }

  });

});