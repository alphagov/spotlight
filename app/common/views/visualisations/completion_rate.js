define([
  'stache!common/templates/visualisations/completion_rate',
  'extensions/views/view',
  'extensions/views/tabs',
  'common/views/visualisations/volumetrics/number',
  'common/views/visualisations/volumetrics/completion-graph'
],
function (template, View, Tabs, VolumetricsNumberView, CompletionGraphView) {
  var CompletionRateView = View.extend({
    template: template,

    initialize: function () {
      View.prototype.initialize.apply(this, arguments);

      if (this.model && this.model.get('tabs')) {
        this.views['#completion-nav'] = {
          view: Tabs,
          options: function () {
            return {
              model: this.collection.query,
              attr: this.model.get('tabbed_attr'),
              tabs: this.model.get('tabs')
            };
          }
        };
      }

    },

    views: {
      '#volumetrics-completion-selected': {
        view: VolumetricsNumberView,
        options: {
          valueAttr: 'totalCompletion',
          selectionValueAttr: 'completion',
          formatValue: function (value) {
            return this.formatPercentage(value);
          }
        }
      },
      '#volumetrics-completion': {
        view: CompletionGraphView,
        options: {
          valueAttr: 'completion'
        }
      }
    }
  });

  return CompletionRateView;
});
