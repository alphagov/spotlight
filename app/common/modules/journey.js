define([
  'extensions/controllers/module',
  'common/collections/journey',
  'common/views/visualisations/conversion-graph/conversion-graph'
],
function (ModuleController, JourneyCollection, ConversionGraph) {
  var JourneyModule = ModuleController.extend({
    className: 'journey',
    visualisationClass: ConversionGraph,
    collectionClass: JourneyCollection,
    clientRenderOnInit: true,
    requiresSvg: true,

    collectionOptions: function () {
      return {
        steps: this.model.get('steps'),
        matchingAttribute: this.model.get('matching-attribute'),
        axisLabels: this.model.get('axis-labels')
      };
    }
  });

  return JourneyModule;
});
