define([
  'extensions/controllers/module',
  'common/collections/journey',
  'common/views/conversion-graph/conversion-graph'
],
function (ModuleController, JourneyCollection, ConversionGraph) {
  var JourneyController = ModuleController.extend({
    className: 'journey',
    visualisationClass: ConversionGraph,
    collectionClass: JourneyCollection,
    clientRenderOnInit: true,

    collectionOptions: function () {
      return {
        steps: this.model.get('steps')
      };
    }
  });

  return JourneyController;
});
