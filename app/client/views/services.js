define([
  'modernizr',
  'extensions/views/view',
  'client/views/table',
  'client/views/summary-figure',
  'client/views/services-kpi',
    'jquerydeparam'
],
function (Modernizr, View, TableView, SummaryFigureView, ServicesKPIS, $) {
  return View.extend({

    events: _.extend({}, View.prototype.events, {
      'keyup #filter': 'filter',
      'search #filter': 'filter',
      'submit #filter-wrapper': 'filterFormSubmit',
      'change #department': 'filter',
      'click .filter-remove': 'removeFilter'
    }),

    initialize: function () {
      View.prototype.initialize.apply(this, arguments);
    },

    views: function () {
      return {
        '.visualisation-table': {
          view: TableView,
          options: {
            collapseOnNarrowViewport: true,
            caption: 'List of services, which can be filtered and sorted',
            saveSortInUrl: true
          }
        },
        '.summary-figure': {
          view: SummaryFigureView
        },
        '.service-kpis': {
          view: ServicesKPIS
        }
      };
    },

    filterFormSubmit: function(e) {
      e.preventDefault();
      this.filter();
    },

    filter: function () {
      var filterVal = this.$('#filter').val(),
        deptFilterVal = this.$('#department').val();

      this.model.set('filter', filterVal);
      this.model.set('departmentFilter', deptFilterVal);

      if (Modernizr.history) {
        var params = $.deparam(window.location.search.substr(1));

        if (filterVal) {
          params.filter = filterVal;
        } else {
          delete params.filter;
        }
        if (deptFilterVal) {
          params.department = deptFilterVal;
        } else {
          delete params.department;
        }

        params = $.param(params);
        window.history.replaceState(null, null, '?' + params);
      }
    },

    removeFilter: function (event) {
      var filter = $(event.target).data('filter');
      this.$('#' + filter).val('');
      this.model.set(filter + 'Filter', null);
    }

  });
});
