define([
  'extensions/views/view',
  'common/views/visualisations/volumetrics/number',
  'common/views/visualisations/volumetrics/completion-graph'
],
function (View, VolumetricsNumberView, CompletionGraphView) {
  return View.extend({

    valueAttr: 'completion',
    totalAttr: 'totalCompletion',

    views: function () {
      return {
        '.volumetrics-completion-selected': {
          view: VolumetricsNumberView,
          options: {
            valueAttr: this.totalAttr,
            selectionValueAttr: this.valueAttr,
            formatValue: function (value) {
              return this.format(value, 'percent');
            }
          }
        },
        '.volumetrics-completion': {
          view: CompletionGraphView,
          options: {
            valueAttr: this.valueAttr
          }
        }
      };
    }

  });
});
