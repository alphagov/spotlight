define([
  'modernizr',
  'extensions/views/view',
  'common/views/filtered_list'
],
function (Modernizr, View, FilteredListView) {
  return View.extend({

    events: _.extend({}, View.prototype.events, {
      'keyup #filter': 'filter',
      'change #department': 'filter',
      'change #agency': 'filter',
      'click .filter-remove': 'removeFilter'
    }),

    initialize: function () {
      View.prototype.initialize.apply(this, arguments);

      if (this.$('#filter').val() || this.$('#department').val() || this.$('#agency').val()) {
        this.filter();
      }
    },

    views: function () {
      return {
        '#services-list': {
          view: FilteredListView
        }
      };
    },

    filter: function () {
      this.model.set('filter', this.$('#filter').val());
      this.model.set('departmentFilter', this.$('#department').val());
      this.model.set('agencyFilter', this.$('#agency').val());

      if (Modernizr.history) {
        var params = $.param({
          filter: this.model.get('filter'),
          department: this.model.get('departmentFilter'),
          agency: this.model.get('agencyFilter')
        });
        window.history.replaceState(null, null, this.$('#filter-wrapper').attr('action') + '?' + params);
      }
    },

    removeFilter: function (event) {
      var filter = $(event.target).data('filter');
      this.$('#' + filter).val('');
      this.model.set(filter + 'Filter', null);
    }

  });
});
