define([
  'stache!common/templates/visualisations/completion_numbers',
  'extensions/views/view',
  'common/views/visualisations/volumetrics/number',
  'common/views/visualisations/volumetrics/submissions-graph',
],
function (template, View, VolumetricsNumberView, SubmissionGraphView) {
  var CompletionNumbersView = View.extend({
    template: template,
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

    views: {
      '#volumetrics-submissions-selected': {
        view: VolumetricsNumberView,
        options: {
          valueAttr: 'mean',
          selectionValueAttr: 'uniqueEvents',
          labelPrefix: 'mean per week over the'
        }
      },
      '#volumetrics-submissions': {
        view: SubmissionGraphView,
        options: {
          valueAttr:'uniqueEvents'
        }
      }
    }
  });

  return CompletionNumbersView;
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
