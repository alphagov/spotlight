define([
  'extensions/controllers/module',
  'common/views/visualisations/user-satisfaction',
  'common/collections/list'
],
function (ModuleController, UserSatisfactionView, ListCollection) {
  var UserSatisfactionModule = ModuleController.extend({
    className: 'user_satisfaction',
    visualisationClass: UserSatisfactionView,
    collectionClass: ListCollection,
    clientRenderOnInit: true,
    requiresSvg: true,
    collectionOptions: function () {
      return {
        id: 'user_satisfaction',
        title: 'User satisfaction',
        sortBy: '_timestamp:descending',
        valueAttr: this.model.get("value-attribute")
      };
    }
  });

  return UserSatisfactionModule;
});
