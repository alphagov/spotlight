define([
  'common/collections/completion'
], function(CompletionCollection) {
  var CompletionRateSeries = CompletionCollection.extend({
    
    queryParams: function () {
      var params = {};
      if (this.options && this.options.tabbedAttr) {
        params[this.options.tabbedAttr] = this.options.tabs[0].id;
      }
      return params;
    },

    parse: function (response) {
      this.data = response.data;
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
      };

      return this.series(completionConfiguration);
    } 

  });

  return CompletionRateSeries;
});

