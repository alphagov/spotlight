define([
  'common/views/visualisations/completion_rate',
  'common/views/visualisations/volumetrics/number',
  'common/views/visualisations/volumetrics/submissions-graph'
],
function (View, VolumetricsNumberView, SubmissionGraphView) {
  return View.extend({

    graphView: SubmissionGraphView,

    views: function () {
      var period = this.collection.options.period || 'week';
      var views = View.prototype.views.apply(this, arguments);

      views['.volumetrics-completion-selected'].options = {
        valueAttr: this.valueAttr,
        labelPrefix: 'mean per ' + period + ' over the'
      };

      return views;
    }

  });
});
