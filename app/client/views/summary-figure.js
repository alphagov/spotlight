define([
  'extensions/views/view'
],
function (View) {

  return View.extend({

    initialize: function () {
      View.prototype.initialize.apply(this, arguments);
      this.listenTo(this.collection, 'reset', this.render);
    },

    render: function() {
      var unit = this.model.get('noun'),
        count;

      count = this.collection.length;
      this.$el.find('.summary-figure-count').html(count);
      if (count !== 1) {
        unit += 's';
      }
      this.$el.find('.summary-figure-unit').html(unit);
    }

  });

});
