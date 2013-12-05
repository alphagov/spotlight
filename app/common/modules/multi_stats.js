define([
  'extensions/controllers/module',
  'common/views/visualisations/multi_stats',
  'common/collections/multi_stats'
],
function (ModuleController, MultiStatsView, MultiStatsCollection) {
  var MultiStatsModule = ModuleController.extend({
    className: 'multi_stats',
    visualisationClass: MultiStatsView,
    collectionClass: MultiStatsCollection,
    collectionOptions: function() { 
      return { 
        stats: this.model.get('stats'), 
        period: this.model.get('period')
      };
    }
  });

  return MultiStatsModule;
});
