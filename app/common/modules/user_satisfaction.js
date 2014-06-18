define([
  'extensions/controllers/module',
  'common/views/visualisations/user-satisfaction',
  'common/collections/list'
],
function (ModuleController, UserSatisfactionView, ListCollection) {
  var UserSatisfactionModule = ModuleController.extend({
    visualisationClass: UserSatisfactionView,
    collectionClass: ListCollection,
    clientRenderOnInit: true,
    collectionOptions: function () {
      return {
        id: 'user_satisfaction',
        title: 'User satisfaction',
        dataSource: this.model.get('data-source'),
        valueAttr: this.model.get('value-attribute')
      };
    }
  });

  return UserSatisfactionModule;
});
