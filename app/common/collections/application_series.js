define([
  'common/collections/volumetrics'
], function(VolumetricsCollection) {
  var CompletionSeries = VolumetricsCollection.extend({

    parse: function () {
      var that = this;
      var applicationConfiguration = {
        id: "done",
        title: "Done",
        modelAttribute: function (event) {
          return {
            uniqueEvents: _.isUndefined(event) ? null : event.totalCompleted
          };
        },
        collectionAttribute: function (events) {
          return {
            mean: that.numberOfJourneyCompletions() / events.length
          };
        }
      }
      return this.series(applicationConfiguration);
    } 

  });

  return CompletionSeries;
});

