define([
  'common/views/visualisations/volumetrics/number',
  'extensions/models/model'
],
function (NumberView, Model) {
  var TargetNumberView = NumberView.extend({

    getValue: function () {
      return this.format(this.getTargetPercent(), 'percent');
    },

    getTargetPercent: function (previous) {
      var target = this.target;
      var total = 0;
      var greaterThanTarget = 0;
      var targetPercent = 1;

      this.collection.each(function (model) {
        if (previous) {
          var previousModel = model.get('values');
          var previousModelValue = new Model(previousModel[previousModel.length - 2]).get(this.valueAttr);
          total += previousModelValue;

          if (target < model.get(this.pinTo)) {
            greaterThanTarget += previousModelValue;
          }
        } else {
          total += model.get(this.valueAttr);

          if (target < model.get(this.pinTo)) {
            greaterThanTarget += model.get(this.valueAttr);
          }
        }
      }, this);

      return targetPercent = targetPercent - (greaterThanTarget / total);
    },

    percentageDifference: function () {
      return this.format(this.getTargetPercent() - this.getTargetPercent(true), 'percent');
    },

    render: function () {
      var content;
      content = '<span class="summary">' + this.getDateRange() + '</span>';
      content += '<' + this.valueTag + '>' + this.getValue() + '</' + this.valueTag + '>';
      content += '<p class="overview">' + this.getLabel() + '</p>';

      var percentageChange = this.getTargetPercent() - this.getTargetPercent(true);
      var decInc = percentageChange < 0 ? 'decrease' : 'increase';
      if (percentageChange === 0) {
        content += '<div class="delta"><span class="no-change">no change</span> <span>on last week</span></div>';
      } else {
        content += '<div class="delta"><span class="' + decInc + '">' + this.percentageDifference() + '</span> <span>on last week</span></div>';
      }

      content += '<p class="overview">' + this.getPreviousDateRange() + '</p>';

      this.$el.html(content);
    },

    getLabel: function () {
      return 'processed within ' + this.target + ' working days';
    },

    getDateRange: function () {
      var presentMonth = _.last(this.collection.first().get('values'));

      console.log(new Model(presentMonth));

      return this.formatPeriod(new Model(presentMonth), this.collection.getPeriod());
    },

    getPreviousDateRange: function () {
      var listOfDates = this.collection.first().get('values');
      var previousMonth = listOfDates[listOfDates.length - 2];

      return this.formatPeriod(new Model(previousMonth), this.collection.getPeriod());
    },

    getPeriod: function () {
      return this.model.get('axis-period') || 'week';
    }
  });

  return TargetNumberView;

});
