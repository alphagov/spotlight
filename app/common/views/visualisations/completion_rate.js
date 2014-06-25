define([
  'extensions/views/view',
  'common/views/visualisations/volumetrics/number',
  'common/views/visualisations/volumetrics/completion-graph'
],
function (View, VolumetricsNumberView, CompletionGraphView) {
  return View.extend({

    graphView: CompletionGraphView,

    views: function () {
      return {
        '.volumetrics-completion-selected': {
          view: VolumetricsNumberView,
          options: {
            valueAttr: this.valueAttr,
            formatOptions: 'percent'
          }
        },
        '.volumetrics-completion': {
          view: this.graphView,
          options: {
            valueAttr: this.valueAttr
          }
        }
      };
    }

  });
});
