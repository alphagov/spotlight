define([
  'extensions/views/view'
],
function (View) {

  return View.extend({

    initialize: function (options) {
      View.prototype.initialize.apply(this, arguments);
      this.listenTo(this.collection, 'change:filteredCount', this.render);
    },

    render: function(c) {
      var unit = this.model.get('noun'),
        count;

      count = (typeof c === 'object') ? c.context.filteredCount : c;
      this.$el.find('.summary-figure-count').html(count);
      if (count !== 1) {
        unit += 's';
      }
      this.$el.find('.summary-figure-unit').html(unit);
    }

  });

});
