define([
  'common/views/visualisations/volumetrics/number',
  'extensions/models/model'
],
function (SingleStatView, Model) {
  var TargetNumberView = SingleStatView.extend({

    getValue: function () {
      var target = this.target;
      var total = 0;
      var greaterThanTarget = 0;
      var targetPercent = 1;

      this.collection.each(function (model) {
        total += model.get(this.valueAttr);
        if (target <= model.get(this.pinTo)) {
          greaterThanTarget += model.get(this.valueAttr);
        }
      }, this);

      targetPercent = targetPercent - (greaterThanTarget / total);

      return this.format(targetPercent, 'percent');
    },

    render: function () {
      var content;
      content = '<' + this.valueTag + '>' + this.getValue() + '</' + this.valueTag + '>';
      content += '<p>' + this.getLabel() + '</p>';
      content += '<p class="period">' + this.getDateRange() + '</p>';
      this.$el.html(content);
    },

    getLabel: function () {
      return 'processed within ' + this.target + ' working days';
    },

    getDateRange: function () {
      var presentMonth = _.last(this.collection.first().get('values'));

      return this.formatPeriod(new Model(presentMonth), this.collection.getPeriod());
    },

    getPeriod: function () {
      return this.model.get('axis-period') || 'week';
    }
  });

  return TargetNumberView;

});
