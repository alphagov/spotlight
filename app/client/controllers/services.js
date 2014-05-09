define([
  'extensions/controllers/controller',
  'common/collections/dashboards',
  'client/views/services'
], function (Controller, FilteredListCollection, ServicesView) {
  return Controller.extend({
    collectionClass: FilteredListCollection,
    viewClass: ServicesView,
    clientRenderOnInit: true,
    renderView: function (options) {
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
    viewOptions: function () {
      return {
        el: '#content'
      };
    }
  });
});
