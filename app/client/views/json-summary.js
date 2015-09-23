define([
  'extensions/views/view'
], function (View) {
  return View.extend({

    initialize: function () {

        this.listenTo(this.collection, 'reset add remove', this.render);
    },

    render: function(){

        var jsonUpdated = this.collection.url();
        var jsonLink;

        var $newEl;
        var $oldEl = this.$el;

        jsonLink = '<a href="' + jsonUpdated + '">JSON</a>';
        $newEl = $(jsonLink);

        this.setElement($newEl);
        $oldEl.replaceWith($newEl);

        return this;
    }

 });
});