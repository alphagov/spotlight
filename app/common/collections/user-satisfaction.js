define([
  'extensions/collections/matrix'
], function (Collection) {

  return Collection.extend({
    initialize: function (models, options) {
      this.start_at = options.startAt || null;
      Collection.prototype.initialize.apply(this, arguments);
    },
    toPercent: function (score) {
      if (isNaN(score)) {
        return null;
      }
      return (score - this.options.min) / (this.options.max - this.options.min);
    },
    queryParams: function () {
      return {
        collect: [
          'rating_1:sum',
          'rating_2:sum',
          'rating_3:sum',
          'rating_4:sum',
          'rating_5:sum',
          'total:sum'
        ],
        start_at: this.start_at,
        period: this.options.period,
        duration: this.options.duration
      };
    },
    parse: function (response) {
      response.data = response.data || [];
      var totalscore = 0;
      var totalratings = 0;
      _.each(response.data, function (datapoint) {
        var score = 0;
        _.each(_.range(this.options.min, this.options.max + 1), function (i) {
          score += (datapoint['rating_' + i + ':sum'] * i);
        });
        totalscore += score;
        totalratings += datapoint['total:sum'];
        var mean = score / datapoint['total:sum'];
        datapoint[this.options.valueAttr] = this.toPercent(mean);
      }, this);
      if (this.options.trim) {
        this.trim(response.data, this.options.trim);
      }
      var parsed = {
        values: response.data,
        id: this.options.id,
        title: this.options.title,
        periods: {
          total: response.data.length,
          available: _.filter(response.data, function (v) { return v[this.options.valueAttr] !== null; }, this).length
        }
      };
      parsed[this.options.totalAttr] = this.toPercent(totalscore / totalratings);
      return parsed;
    }
  });

});