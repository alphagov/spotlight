define([
  'extensions/controllers/module',
  'common/collections/journey',
  'extensions/views/conversion-graph/conversion-graph',
  'extensions/views/conversion-success-rate'
],
function (ModuleController, VisitorsRealtimeView, VisitorsRealtimeCollection) {
  var JourneyController = ModuleController.extend({
    className: 'journey',
    visualisationClass: VisitorsRealtimeView,
    collectionClass: JourneyCollection,
    clientRenderOnInit: true,

    collectionOptions: function () {
      return {
        steps: this.model.get('steps')
      };
    },

  });

  return JourneyController;
});
