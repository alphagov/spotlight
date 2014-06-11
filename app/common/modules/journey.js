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
        filterBy: this.model.get('filter-by'),
        format: {
          type: 'integer',
          magnitude: true,
          sigfigs: 3
        },
        axes: _.merge({
          y: []
        }, this.model.get('axes'))
      };
    },

    visualisationOptions: function () {
      return _.defaults(ModuleController.prototype.visualisationOptions.apply(this, arguments), {
        valueAttr: 'uniqueEvents'
      });
    }

  });

  return JourneyModule;
});
