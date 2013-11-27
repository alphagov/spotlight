define([
  'stache!common/templates/visualisations/completion_numbers',
  'extensions/views/view',
  'common/views/visualisations/volumetrics/number',
  'common/views/visualisations/volumetrics/submissions-graph'
],
function (template, View, VolumetricsNumberView, SubmissionGraphView) {
  var CompletionNumbersView = View.extend({
    template: template,

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
