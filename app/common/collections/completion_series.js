define([
  'common/collections/volumetrics'
], function(VolumetricsCollection) {
  var CompletionSeries = VolumetricsCollection.extend({

    parse: function () {
      var that = this;
      var completionConfiguration = {
        id: "completion",
        title: "Completion rate",
        modelAttribute: function (event) {
          return {
            completion: that.findCompletion(event)
          };
        },
        collectionAttribute: function () {
          return {
            totalCompletion: that.completionRate()
          };
        }
      }

      return this.series(completionConfiguration);
    } 

  });

  return CompletionSeries;
});

