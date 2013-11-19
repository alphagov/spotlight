define([
  'extensions/controllers/module',
  'common/views/visualisations/completion_rate',
  'common/collections/completion_rate'
],
function (ModuleController, CompletionRateView, CompletionRateCollection) {
  var CompletionRateModule = ModuleController.extend({
    className: 'availability',
    visualisationClass: CompletionRateView,
    collectionClass: CompletionRateCollection,
    clientRenderOnInit: true,

    collectionOptions: function () {
      return {
        startMatcher: /start$/,
        endMatcher: /done$/,
        matchingAttribute: "eventCategory"
      };
    }
  });

  return CompletionRateModule;
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
