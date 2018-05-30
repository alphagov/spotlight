define([
  './table'
],
function (TableView) {

  var TableViewFallback = TableView.extend({

     initialize: function (options) {

      this.options = options || {};
      var existingCollection = this.options.collection || this.collection;

      this.collection = new existingCollection.constructor(existingCollection.toJSON(), existingCollection.options);

      this.valueAttr = this.options.valueAttr;
      this.period = this.collection.getPeriod();

      if (this.collection.models.length > 0) {
        this.collection.models = this.collection.last(6);
        this.collection.length = this.collection.models.length;
        this.listenTo(this.collection, 'reset add remove', this.render);
        this.initSort();
      }
    }

  });

   _.extend(TableViewFallback.prototype);

  return TableViewFallback;

});
