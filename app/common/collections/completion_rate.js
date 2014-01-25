define([
  'common/collections/completion',
  'extensions/collections/collection'
], function(CompletionCollection, Collection) {
  var CompletionRateSeries = CompletionCollection.extend({
    
    queryParams: function () {
      var params = {};
      
      if (this.options) {
        if (this.options.tabbedAttr) {
          params[this.options.tabbedAttr] = this.options.tabs[0].id;
        }
        if (this.options.period || this.period) {
          params.period = this.options.period || this.period;
        }
        if (this.options.duration || this.duration) {
          params.duration = this.options.duration || this.duration;
        }
        if (this.options.category) {
          params.group_by = this.options.category;
        }
      }
      params.collect = this.valueAttr;
      params.group_by = this.matchingAttribute;
      
      return params;
    },

    parse: function (response) {
      this.data = response.data;
      var values = [], value;

      var periods = response.data[0].values.length;

      _.times(periods, function(i){
        value = {
          _start_at: this.getMoment(response.data[0].values[i]._start_at),
          _end_at: this.getMoment(response.data[0].values[i]._end_at)
        };
        startTotal = 0;
        endTotal = 0;
        _.each(response.data, function(d){
          if(d[this.matchingAttribute].match(this.startMatcher) !== null){
            startTotal += d.values[i][this.valueAttr];
          }
          if(d[this.matchingAttribute].match(this.endMatcher) !== null){
            endTotal += d.values[i][this.valueAttr];
          }
        }, this);
        if(startTotal > 0){
          value.completion = endTotal / startTotal;
        } else {
          value.completion = null;
        }
        values.push(value);
      }, this);

      return {
        id: "completion",
        title: "Completion rate",
        values: new Collection(values).models,
        weeks: {
          total: values.length,
          available: values.length
        }
      };

      
      // If we have nested data, make it flat.
      var newData = [];
      _.each(this.data, function(d) {
        if (d.values) {
          var attr = this.options.matchingAttribute;
          var category = d[attr];
          _.each(d.values, function(e) {
            e[attr] = category;
            if (!e._timestamp) {
              e._timestamp = e._start_at;
            }
            if (!e._month_start_at) {
              e._month_start_at = e._start_at;
            }
            newData.push(e);
          });
        }
      }, this);
      
      this.data = (newData.length) ? newData : this.data;

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

