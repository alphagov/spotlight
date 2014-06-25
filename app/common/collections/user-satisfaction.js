define([
  'extensions/collections/collection'
], function (Collection) {

  return Collection.extend({
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
        start_at: this.options.startAt,
        period: this.options.period,
        duration: this.options.duration
      };
    },
    parse: function (response) {
      response.data = response.data || [];
      _.each(response.data, function (datapoint) {
        var score = 0;
        _.each(_.range(this.options.min, this.options.max + 1), function (i) {
          score += (datapoint['rating_' + i + ':sum'] * i);
        });
        var mean = score / datapoint['total:sum'];
        datapoint[this.options.valueAttr + ':sum'] = score;
        datapoint[this.options.valueAttr] = this.toPercent(mean);
      }, this);
      if (this.options.trim) {
        this.trim(response.data, this.options.trim);
      }
      return response.data;
    },

    mean: function (attr) {
      if (attr === this.options.valueAttr) {
        var sum = this.total(this.options.valueAttr + ':sum');
        var total = this.total('total:sum');
        return this.toPercent(sum / total);
      }
    }

  });

});