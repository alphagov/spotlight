define([
  'extensions/views/view',
  'common/views/filtered_list'
],
function (View, ListView) {
  return View.extend({

    events: _.extend({
      'keyup #filter': 'filter'
    }, View.prototype.events),

    views: function () {
      return {
        '#services-list': {
          view: ListView
        }
      };
    },

    filter: function (e) {
      this.model.set('filter', $(e.target).val());
    }

  });
});
