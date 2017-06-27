define([
  'extensions/views/view'
], function (View) {
  return View.extend({

    initialize: function () {

        this.listenTo(this.collection, 'reset add remove', this.render);
    },

    render: function(){

        var url = this.collection.url();
        var urlJson = url+'&format=json';
        var urlCSV = url + '&format=csv';
        var $newEl;
        var $oldEl = this.$el;

        $newEl = $('<a href="' + urlJson + '">JSON</a> | <a href="' + urlCSV + '">CSV</a>');

        this.setElement($newEl);
        $oldEl.replaceWith($newEl);

        return this;
    }

 });
});