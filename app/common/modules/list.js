define([
  'extensions/controllers/module',
  'common/views/visualisations/list',
  'common/collections/list'
],
function (ModuleController, ListView, ListCollection) {

  var ListModule = ModuleController.extend({
    visualisationClass: ListView,
    collectionClass: ListCollection,
    clientRenderOnInit: false,
    requiresSvg: false,
    hasTable: false,

    collectionOptions: function () {
      return {
        'id': 'list',
        'title': 'List',
        'queryParams': this.model.get('query-params'),
        'labelAttr': this.model.get('label-attr'),
        'labelRegex': this.model.get('label-regex'),
        'linkAttr': this.model.get('link-attr'),
        'urlRoot': this.model.get('url-root')
      };
    }
  });

  return ListModule;

});
