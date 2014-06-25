define([
  'common/collections/completion'
], function (CompletionCollection) {
  var CompletionRateSeries = CompletionCollection.extend({
    defaultValueAttrs: function (value) {
      return {
        completion: value._start > 0 ? value._end / value._start : null
      };
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

