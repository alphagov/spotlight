define([
  'common/collections/completion'
], function (CompletionCollection) {
  var CompletionRateSeries = CompletionCollection.extend({
    defaultValueAttrs: function (value) {
      return {
        completion: value._start > 0 ? value._end / value._start : null
      };
    },

    parse: function (response) {
      var values = [],
      data = response.data;
      if (data && data.length > 0 && (data[0].values || this.flat)) {
        values = this.calculateCompletion(response.data);
      }
      return values;
    },

    calculateCompletion: function (dataset) {
      if (this.flat) {
        return _.map(_.filter(dataset, function(data) {
          return data[this.matchingAttribute] && data[this.matchingAttribute].match(this.denominatorMatcher);
        }, this), function (model) {
          var matchingStart, matchingEnd;
          if (model[this.valueAttr] !== null) {
            matchingStart = _.find(dataset, function (data) {
              return data['_start_at'] === model['_start_at'] && data[this.matchingAttribute] && data[this.matchingAttribute].match(this.denominatorMatcher);
            }, this);
            matchingEnd = _.find(dataset, function (data) {
              return data['_end_at'] === model['_end_at'] && data[this.matchingAttribute] && data[this.matchingAttribute].match(this.numeratorMatcher);
            }, this);
          }
          var totals = {};
          totals['start'] = (matchingStart ? matchingStart[this.valueAttr]: null);
          totals['end'] = (matchingEnd ? matchingEnd[this.valueAttr]: null);

          var value = {
            _start_at: this.getMoment(model._start_at),
            _end_at: this.getMoment(model._end_at),
            _start: totals.start,
            _end: totals.end
          };
          return _.extend(this.defaultValueAttrs(value), value);

        }, this);
      } else {
        return _.map(dataset[0].values, function (model, i){
          var totals = _.reduce(dataset, function (memo, d) {
            if (d.values[i][this.valueAttr] !== null) {
              if (d[this.matchingAttribute].match(this.denominatorMatcher) !== null) {
                memo.start += d.values[i][this.valueAttr];
              }
              if (d[this.matchingAttribute].match(this.numeratorMatcher) !== null) {
                memo.end += d.values[i][this.valueAttr];
              }
            }
            return memo;
          }, {start: null, end: null}, this);

          var value = {
            _start_at: this.getMoment(model._start_at),
            _end_at: this.getMoment(model._end_at),
            _start: totals.start,
            _end: totals.end
          };
          return _.extend(this.defaultValueAttrs(value), value);

        }, this);
      }
    },

    mean: function (attr) {
      if (attr === 'completion') {
        var started = this.total('_start');
        var ended = this.total('_end');
        return !started ? null : ended / started;
      } else {
        return CompletionCollection.prototype.mean.apply(this, arguments);
      }
    }
  });

  return CompletionRateSeries;
});

