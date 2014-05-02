define([
  'extensions/views/view',
  'common/views/filtered_list'
],
function (View, FilteredListView) {
  return View.extend({

    events: _.extend({}, View.prototype.events, {
      'keyup #filter': 'filter'
    }),

    initialize: function () {
      View.prototype.initialize.apply(this, arguments);
      if (this.$('#filter').val()) {
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
    }

  });
});
