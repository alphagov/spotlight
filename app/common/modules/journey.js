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
      var options = {
        matchingAttribute: this.model.get('matching-attribute'),
        axes: _.merge({
          y: []
        }, this.model.get('axes'))
      };
      options.format = this.model.get('format') ||
        { type: 'integer', magnitude: true, sigfigs: 3 };
      return options;
    },

    visualisationOptions: function () {
      if (this.model.get('value-attribute')) {
        return {
          valueAttr: this.model.get('value-attribute')
        };
      }
      return;
    }
  });

  return JourneyModule;
});
