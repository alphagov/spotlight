define([
  'extensions/controllers/module',
  'common/views/visualisations/list',
  'common/collections/list'
],
function (ModuleController, ListView, ListCollection) {

  var ListModule = ModuleController.extend({
    className: 'list',
    visualisationClass: ListView,
    collectionClass: ListCollection,
    clientRenderOnInit: false,
    requiresSvg: false,

    collectionOptions: function() {
      return {
        "id": "list",
        "title": "List",
        "sortBy": this.model.get('sort-by'),
        "limit": this.model.get('limit'),
        "labelAttr": this.model.get('label-attr'),
        "labelRegex": this.model.get('label-regex'),
        "linkAttr": this.model.get('link-attr'),
        "urlRoot": this.model.get('url-root')
      };
    }
  });

  return ListModule;

});
