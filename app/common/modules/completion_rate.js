define([
  'extensions/controllers/module',
  'common/views/visualisations/tabbed_availability',
  'common/collections/availability'
],
function (ModuleController, TabbedAvailabilityView, AvailabilityCollection) {
  var CompletionModule = ModuleController.extend({
    className: 'availability',
    visualisationClass: TabbedAvailabilityView,
    collectionClass: AvailabilityCollection,
    clientRenderOnInit: true
  });

  return CompletionModule;
});
//define([
//  'extensions/collections/graphcollection',
//  'extensions/collections/volumetrics',
//  'fco/views/volumetrics-submissions-graph',
//  'extensions/views/volumetrics/completion-graph',
//  'extensions/views/volumetrics/number'
//],
//function (GraphCollection, VolumetricsCollection,
//  VolumetricsSubmissionsGraph, VolumetricsCompletionGraph, VolumetricsNumberView) {
//
//    var volumetricsCollection = new VolumetricsCollection([], {
//      serviceName: serviceName,
//      startMatcher: /start$/,
//      endMatcher: /done$/,
//      matchingAttribute: "eventCategory"
//    });
//
//    var volumetricsCompletion = new GraphCollection();
//    volumetricsCollection.on('reset', function () {
//      volumetricsCompletion.reset([volumetricsCollection.completionSeries()]);
//    });
//
//    var volumetricsCompletionNumber = new VolumetricsNumberView({
//      collection:volumetricsCompletion,
//      el:$('#volumetrics-completion-selected'),
//      valueAttr: 'totalCompletion',
//      selectionValueAttr: 'completion',
//      formatValue: function (value) {
//        return this.formatPercentage(value);
//      }
//    });
//
//    var volumetricsCompletionGraph = new VolumetricsCompletionGraph({
//      el:$('#volumetrics-completion'),
//      collection:volumetricsCompletion,
//      valueAttr:'completion'
//    });
//
//    volumetricsCollection.fetch();
//  
//});
