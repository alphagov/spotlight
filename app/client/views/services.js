define([
  'extensions/views/view',
  'common/views/filtered_list'
],
function (View, FilteredListView) {
  return View.extend({

    events: _.extend({
      'keyup #filter': 'filter'
    }, View.prototype.events),

    views: function () {
      return {
        '#services-list': {
          view: FilteredListView
        }
      };
    },

    filter: function (e) {
      this.model.set('filter', $(e.target).val());
    }

  });
});
