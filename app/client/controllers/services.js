define([
  'extensions/controllers/controller',
  'common/collections/dashboards',
  'client/views/services'
], function (Controller, DashboardsCollection, ServicesView) {
  return Controller.extend({
    collectionClass: DashboardsCollection,
    viewClass: ServicesView,
    clientRenderOnInit: true,

    initialize: function() {
      this.listenTo(this.model, 'change:filter change:departmentFilter', this.updateCollectionFilter);
    },

    updateCollectionFilter: function () {
      var filteredList = this.unfilteredCollection.filterServices({
        text: this.model.get('filter'),
        department: this.model.get('departmentFilter')
      });

      this.collection.reset(filteredList);
    },

    renderView: function (options) {
      this.unfilteredCollection = new DashboardsCollection(this.collection.models, this.collection.options);

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
