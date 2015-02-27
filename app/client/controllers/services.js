define([
  'extensions/controllers/controller',
  'common/collections/services',
  'client/views/services'
], function (Controller, ServicesCollection, ServicesView) {
  return Controller.extend({
    collectionClass: ServicesCollection,
    viewClass: ServicesView,
    clientRenderOnInit: true,

    initialize: function() {
      this.listenTo(this.model, 'filterChanged', this.updateCollectionFilter);
    },

    updateCollectionFilter: function () {
      var filteredList = this.unfilteredCollection.filterServices({
        text: this.model.get('filter'),
        department: this.model.get('departmentFilter'),
        serviceGroup: this.model.get('serviceGroupFilter')
      });

      this.collection.reset(filteredList);
    },

    renderView: function (options) {
      this.unfilteredCollection = new ServicesCollection(this.collection.models, this.collection.options);

      this.updateCollectionFilter();
      options = _.extend({}, this.viewOptions(), options);
      if (!this.view) {
        this.view = new this.viewClass(options);
      }
      this.view.render();
      this.trigger('ready');
      this.trigger('loaded');
    },
    collectionData: function () {
      return this.model.get('data');
    },
    collectionOptions: function() {
      return this.model.get('axesOptions');
    },
    viewOptions: function () {
      return {
        el: '#content'
      };
    }
  });
});
