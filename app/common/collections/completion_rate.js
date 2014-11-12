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
      if (data && data.length > 0 && (data[0].values || this._isFlat())) {
        values = this.calculateCompletion(data);
      }
      return values;
    },

    calculateCompletion: function (dataset) {
      if (this._isFlat()) {
        var timeGroupedData = _.groupBy(dataset, function (elem) {
          return elem['_start_at'];
        });

        var parsedData = _.map(timeGroupedData, function (value) {

          var matchingStart, matchingEnd;

          matchingStart = _.filter(value, function (data) {
            return data[this.matchingAttribute] && data[this.valueAttr] && data[this.matchingAttribute].match(this.denominatorMatcher);
          }, this);

          matchingEnd = _.filter(value, function (data) {
            return data[this.matchingAttribute] && data[this.valueAttr] && data[this.matchingAttribute].match(this.numeratorMatcher);
          }, this);

          var parsedDatum = {
            _start_at: this.getMoment(value[0]._start_at),
            _end_at: this.getMoment(value[0]._end_at)
          };

          if (matchingStart.length > 0) {
            parsedDatum._start = _.reduce(matchingStart, function (memo, elem) {
              return memo + elem[this.valueAttr];
            }, 0, this);
          } else {
            parsedDatum._start = null;
          }

          if (matchingEnd.length > 0) {
            parsedDatum._end = _.reduce(matchingEnd, function (memo, elem) {
              return memo + elem[this.valueAttr];
            }, 0, this);
          } else {
            parsedDatum._end = null;
          }

          return _.extend(this.defaultValueAttrs(parsedDatum), parsedDatum);
        }, this);

        return parsedData;

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

