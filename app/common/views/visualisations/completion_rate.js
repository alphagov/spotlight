define([
  'stache!common/templates/visualisations/completion_rate',
  'extensions/views/view',
  'common/views/visualisations/volumetrics/number',
  'common/views/visualisations/volumetrics/completion-graph',
],
function (template, View, VolumetricsNumberView, CompletionGraphView) {
  var CompletionRateView = View.extend({
    template: template,

    views: {
      '#volumetrics-completion-selected': {
        view: VolumetricsNumberView,
        options: {
          valueAttr: 'totalCompletion',
          selectionValueAttr: 'completion',
          formatValue: function (value) {
            //where defined?
            //return this.formatPercentage(value);
            return value;
          }
        }
      },
      '#volumetrics-completion': {
        view: CompletionGraphView,
        options: {
          valueAttr:'completion'
        }
      }
    }
  });

  return CompletionRateView;
});
