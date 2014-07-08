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

      var periods = 0,
          values = [];

      if (response.data && response.data.length > 0 && response.data[0].values) {
        periods = response.data[0].values.length;
      }
      _.times(periods, function (i) {
        var totals = _.reduce(response.data, function (memo, d) {
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
          _start_at: this.getMoment(response.data[0].values[i]._start_at),
          _end_at: this.getMoment(response.data[0].values[i]._end_at),
          _start: totals.start,
          _end: totals.end
        };
        values.push(_.extend(this.defaultValueAttrs(value), value));

      }, this);

      return values;
    },

    mean: function (attr) {
      if (attr === 'completion') {
        var started = this.total('_start');
        var ended = this.total('_end');
        return ended / started;
      } else {
        return CompletionCollection.prototype.mean.apply(this, arguments);
      }
    }
  });

  return CompletionRateSeries;
});

