define([
  'extensions/views/view',
  'common/views/filtered_list'
],
function (View, FilteredListView) {
  return View.extend({

    events: _.extend({}, View.prototype.events, {
      'keyup #filter': 'filter',
      'change #department': 'filter',
      'change #agency': 'filter'
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
    }

  });
});
