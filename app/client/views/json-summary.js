define([
  'extensions/views/view'
], function (View) {
  return View.extend({

    initialize: function () {

      this.listenTo(this.collection, 'reset add remove', this.render);
    },

    render: function() {

      var url = this.collection.url();
      var urlJson = url+'&format=json';
      this.$el.html( $('<a href="' + urlJson + '">JSON</a>') );

      return this;
    }

 });
});
