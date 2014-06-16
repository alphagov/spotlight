define([
  'stache!common/templates/visualisations/completion_numbers',
  'extensions/views/view',
  'common/views/visualisations/volumetrics/number',
  'common/views/visualisations/volumetrics/submissions-graph'
],
function (template, View, VolumetricsNumberView, SubmissionGraphView) {
  var CompletionNumbersView = View.extend({
    template: template,

    views: function () {
      var period = this.collection.options.period || 'week';
      return {
        '#volumetrics-submissions-selected': {
          view: VolumetricsNumberView,
          options: {
            valueAttr: 'mean',
            selectionValueAttr: this.valueAttr || 'uniqueEvents',
            labelPrefix: 'mean per ' + period + ' over the'
          }
        },
        '#volumetrics-submissions': {
          view: SubmissionGraphView,
          options: {
            valueAttr: this.valueAttr || 'uniqueEvents'
          }
        }
      };

    }

  });

  return CompletionNumbersView;
});
