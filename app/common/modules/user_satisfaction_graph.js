define([
  'extensions/controllers/module',
  'common/views/visualisations/completion_rate',
  'common/collections/user-satisfaction'
],
function (ModuleController, UserSatisfactionView, UserSatisfactionCollection) {
  var UserSatisfactionModule = ModuleController.extend({
    visualisationClass: UserSatisfactionView,
    collectionClass: UserSatisfactionCollection,
    clientRenderOnInit: true,
    requiresSvg: true,
    collectionOptions: function () {
      return {
        id: 'user_satisfaction',
        title: 'User satisfaction',
        sortBy: '_timestamp:ascending',
        limit: 0,
        min: 1,
        max: 5,
        totalAttr: 'totalRatings',
        valueAttr: this.model.get('value-attribute'),
        period: this.model.get('period') || 'day',
        duration: this.model.get('duration') || 63,
        trim: this.model.get('trim') || 8
      };
    },
    visualisationOptions: function () {
      return {
        totalAttr: 'totalRatings',
        valueAttr: this.model.get('value-attribute')
      };
    }
  });

  return UserSatisfactionModule;
});
