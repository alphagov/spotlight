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
//  return function (serviceName) {
//    if ($('.lte-ie8').length) {
//      // do not attempt to show graphs in legacy IE
//      return;
//    }
//
//    var volumetricsCollection = new VolumetricsCollection([], {
//      serviceName: serviceName,
//      startMatcher: /start$/,
//      endMatcher: /done$/,
//      matchingAttribute: "eventCategory"
//    });
//
//    var volumetricsSubmissions = new GraphCollection();
//    volumetricsCollection.on('reset', function () {
//      volumetricsSubmissions.reset([volumetricsCollection.applicationsSeries()]);
//    });
//
//    var volumetricsCompletion = new GraphCollection();
//    volumetricsCollection.on('reset', function () {
//      volumetricsCompletion.reset([volumetricsCollection.completionSeries()]);
//    });
//
//    var relayed = false;
//    volumetricsSubmissions.on('change:selected', function (group, groupIndex, model, index) {
//      if (relayed) {
//        relayed = false;
//      } else {
//        relayed = true;
//        volumetricsCompletion.selectItem(groupIndex, index);
//      }
//    });
//    volumetricsCompletion.on('change:selected', function (group, groupIndex, model, index) {
//      if (relayed) {
//        relayed = false;
//      } else {
//        relayed = true;
//        volumetricsSubmissions.selectItem(groupIndex, index);
//      }
//    });
//
//    var volumetricsSubmissionsNumber = new VolumetricsNumberView({
//      collection:volumetricsSubmissions,
//      el:$('#volumetrics-submissions-selected'),
//      valueAttr: 'mean',
//      selectionValueAttr: 'uniqueEvents',
//      labelPrefix: 'mean per week over the'
//    });
//
//    var volumetricsSubmissionsGraph = new VolumetricsSubmissionsGraph({
//      el:$('#volumetrics-submissions'),
//      collection:volumetricsSubmissions,
//      valueAttr:'uniqueEvents'
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
//  };
//  
//});
