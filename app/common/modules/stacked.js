//https://www.preview.performance.service.gov.uk/data/housing-policy/residential-transactions?collect=value%3Asum&period=month&group_by=geography&filter_by=key%3Aresidential_property_transactions&end_at=2013-12-01T00%3A00%3A00%2B00%3A00&start_at=2012-12-01T00%3A00%3A00%2B00%3A00

//https://www.preview.performance.service.gov.uk/data/housing-policy/residential-transactions
define([
  'extensions/controllers/module',
  'common/views/visualisations/completion_rate',
  'common/collections/completion_rate'
],
function (ModuleController, CompletionRateView, CompletionRateCollection) {
  var CompletionRateModule = ModuleController.extend({
    className: 'completion_rate',
    visualisationClass: CompletionRateView,
    collectionClass: CompletionRateCollection,
    clientRenderOnInit: true,
    requiresSvg: true,

    collectionOptions: function () {
      return {
        startMatcher: new RegExp(this.model.get('start-matcher')),
        endMatcher: new RegExp(this.model.get('end-matcher')),
        matchingAttribute: this.model.get('matching-attribute')
      };
    }
  });

  return CompletionRateModule;
});
//define([
//  'extensions/controllers/module',
//  'common/views/visualisations/completion_rate',
//  'common/collections/completion_rate'
//],
//function (ModuleController, CompletionRateView, CompletionRateCollection) {
//  var CompletionRateModule = ModuleController.extend({
//    className: 'completion_rate',
//    visualisationClass: CompletionRateView,
//    collectionClass: CompletionRateCollection,
//    clientRenderOnInit: true,
//    requiresSvg: true,
//
//    collectionOptions: function () {
//      return {
//        startMatcher: new RegExp(this.model.get('start-matcher')),
//        endMatcher: new RegExp(this.model.get('end-matcher')),
//        matchingAttribute: this.model.get('matching-attribute')
//      };
//    }
//  });
//
//  return CompletionRateModule;
//});
//THE COLLECTION
//define([
//  'extensions/collections/graphcollection'
//],
//function (GraphCollection) {
//  var VolumetricsCollection = GraphCollection.extend({
//
//    serviceName: 'vehicle-licensing',
//    apiName: 'volumetrics',
//
//    queryParams: function () {
//      return {
//        collect: 'volume:sum',
//        period: 'month',
//        group_by: 'channel',
//        filter_by: this.options.type ? ['service:' + this.options.type] : []
//      }
//    },
//
//    seriesList: [
//      { id: 'fully-digital', title: 'Digital' },
//      { id: 'assisted-digital', title: 'Post Office' },
//      { id: 'manual', title: 'Manual' }
//    ],
//
//    parse: function (response) {
//      var data = response.data;
//
//      return _.map(this.seriesList, function (series) {
//        var dataSeries = _.find(data, function (d) {
//          return d.channel === series.id;
//        });
//
//        return _.extend({}, series, {
//          values: dataSeries.values
//        });
//      });
//    }
//
//  });
//
//  return VolumetricsCollection;
//});
