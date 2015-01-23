define([
  'client/views/table'
],
function (TableView) {

  return TableView.extend({

    initialize: function (options) {
      TableView.prototype.initialize.apply(this, arguments);
      this.listenTo(this.model, 'change:filter change:departmentFilter', this.filterCollection);
    },

    filterCollection: function () {
      var filteredList = this.collection.filterServices({
        text: this.model.get('filter'),
        department: this.model.get('departmentFilter')
      });

      this.tableCollection.reset(filteredList);
    }

  });

});