define([
  'modernizr',
  'extensions/views/view',
  'client/views/table',
  'client/views/summary-figure',
  'client/views/services-kpi',
  'jquerydeparam',
  'lodash'
],
function (Modernizr, View, TableView, SummaryFigureView, ServicesKPIS, $, _) {
  return View.extend({

    analyticsCategory: 'ppServices',

    events: _.extend({}, View.prototype.events, {
      'keyup #filter': function() {
        this.filter('filter');
      },
      'search #filter': function() {
        this.filter('filter');
      },
      'submit #filter-wrapper': 'filterFormSubmit',
      'change #department': function() {
        this.filter('department');
      }
    }),

    initialize: function () {
      View.prototype.initialize.apply(this, arguments);
      this.model.on('removeFilter', _.bind(this.removeFilter, this));
    },

    views: function () {
      return {
        '.visualisation-table': {
          view: TableView,
          options: {
            collapseOnNarrowViewport: true,
            caption: 'List of services, which can be filtered and sorted',
            saveSortInUrl: true,
            analytics: {
              category: this.analyticsCategory
            }
          }
        },
        '.summary-figure': {
          view: SummaryFigureView
        },
        '.service-kpis': {
          view: ServicesKPIS,
          options: {
            analytics: {
              category: this.analyticsCategory
            }
          }
        }
      };
    },

    filterFormSubmit: function(e) {
      e.preventDefault();
      this.filter();
    },

    filter: function (type) {
      var filterVal = this.$('#filter').val(),
        deptFilterVal = this.$('#department').val(),
        serviceGroupFilterVal = this.$('#service-group').val();

      this.model.set({
        filter: filterVal,
        departmentFilter: deptFilterVal,
        departmentFilterTitle: this.collection.getDepartmentFilterTitle(deptFilterVal),
        serviceGroupFilter: serviceGroupFilterVal,
        serviceGroupFilterTitle: this.collection.getServiceGroupFilterTitle(serviceGroupFilterVal)
      }, {silent: true});

      this.model.trigger('filterChanged');

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
        if (serviceGroupFilterVal) {
          params.servicegroup = serviceGroupFilterVal;
        } else {
          delete params.servicegroup;
        }

        params = $.param(params);
        window.history.replaceState(null, null, '?' + params);
      }

      this.filterAnalytics(type);
    },

    removeFilter: function (filter) {
      var $filter = this.$('#' + filter);

      if ($filter.length) {
        $filter.val('');
        this.filter(filter);
      }
    },

    filterAnalytics: function(type) {
      var value;

      switch (type) {
        case 'filter':
          value = this.model.get('filter');
          break;
        case 'department':
          value = this.model.get('departmentFilter');
          break;
        case 'service-group':
          value = this.model.get('serviceGroupFilter');
      }
      GOVUK.analytics.trackEvent(this.analyticsCategory, type, {
        label: value,
        nonInteraction: true
      });
    }

  });
});
