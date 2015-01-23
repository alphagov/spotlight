define([
  'modernizr',
  'extensions/views/view',
  'client/views/services-table'
],
function (Modernizr, View, TableView) {
  return View.extend({

    events: _.extend({}, View.prototype.events, {
      'keyup #filter': 'filter',
      'change #department': 'filter',
      'click .filter-remove': 'removeFilter'
    }),

    initialize: function () {
      View.prototype.initialize.apply(this, arguments);

      if (this.$('#filter').val() || this.$('#department').val()) {
        this.filter();
      }
    },

    views: function () {
      return {
        '.visualisation-table': {
          view: TableView,
          options: {
            scrollable: false
          }
        }
      };
    },

    filter: function () {
      this.model.set('filter', this.$('#filter').val());
      this.model.set('departmentFilter', this.$('#department').val());

      if (Modernizr.history) {
        var params = {};

        if (this.model.get('filter')) {
          params.filter = this.model.get('filter');
        }
        if (this.model.get('departmentFilter')) {
          params.department = this.model.get('departmentFilter');
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
