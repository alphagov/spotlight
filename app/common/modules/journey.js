define([
  'extensions/controllers/module',
  'common/collections/journey',
  'common/views/visualisations/journey-graph/journey-graph'
],
function (ModuleController, JourneyCollection, JourneyGraph) {
  var JourneyModule = ModuleController.extend({
    visualisationClass: JourneyGraph,
    collectionClass: JourneyCollection,
    clientRenderOnInit: true,
    requiresSvg: true,

    collectionOptions: function () {
      return {
        matchingAttribute: this.model.get('matching-attribute'),
        format: {
          type: 'integer',
          magnitude: true,
          sigfigs: 3
        },
        axes: _.merge({
          y: []
        }, this.model.get('axes'))
      };
    }
  });

  return JourneyModule;
});
