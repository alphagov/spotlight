define([
  'extensions/collections/matrix',
  'extensions/collections/collection',
  'extensions/models/group',
  'extensions/models/query'
], function(MatrixCollection, Collection, Group, Query) {
  var CompletionRateSeries = MatrixCollection.extend({
    model: Group,

    initialize: function (models, options) {
      this.startMatcher = options.startMatcher;
      this.endMatcher = options.endMatcher;
      this.matchingAttribute = options.matchingAttribute || 'eventCategory';
      this.setValueAttribute(options);
      this.tabbedAttr = options.tabbedAttr || null;
      this.tabs = options.tabs || null;
      this.period = options.period || 'week';
      this.duration = options.duration || Query.prototype.periods[this.period].duration;

      MatrixCollection.prototype.initialize.apply(this, arguments);
    },

    setValueAttribute: function(options) {
      this.valueAttr = options.valueAttr ? options.valueAttr : 'uniqueEvents:sum';
    },

    queryParams: function () {
      var params = {
        collect: this.valueAttr,
        duration: this.duration,
        group_by: this.matchingAttribute,
        period: this.period
      };

      if (this.options && this.options.tabbedAttr) {
        params[this.options.tabbedAttr] = this.options.tabs[0].id;
      }

      return params;
    },

    parse: function (response) {
      this.data = response.data;

      // refresh value attribute to work with tabbed interface
      this.setValueAttribute(this.options);

      var values = [];
      var dataTotals = { start: 0, end: 0 };
      var periods = response.data[0].values.length;

      _.times(periods, function(i){
        var totals = _.reduce(response.data, function(memo, d){
          if(d[this.matchingAttribute].match(this.startMatcher) !== null){
            memo.start += d.values[i][this.valueAttr];
          }
          if(d[this.matchingAttribute].match(this.endMatcher) !== null){
            memo.end += d.values[i][this.valueAttr];
          }
          return memo;
        }, {start: 0, end: 0}, this);

        var value = {
          _start_at: this.getMoment(response.data[0].values[i]._start_at),
          _end_at: this.getMoment(response.data[0].values[i]._end_at),
          completion: totals.start > 0 ? totals.end / totals.start : null
        };
        values.push(value);

        dataTotals.start += totals.start;
        dataTotals.end+= totals.end;
      }, this);

      return {
        id: "completion",
        title: "Completion rate",
        values: new Collection(values).models,
        totalCompletion: dataTotals.start > 0 ? (dataTotals.end/dataTotals.start) : null,
        weeks: {
          total: values.length,
          available: _.filter(values, function(v){ return v.completion !== null; }).length
        }
      };
    }

  });

  return CompletionRateSeries;
});

