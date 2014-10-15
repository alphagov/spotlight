define([
  'common/views/visualisations/volumetrics/number',
  'extensions/models/model'
],
function (SingleStatView, Model) {
  var TargetNumberView = SingleStatView.extend({

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
          total += new Model(previousModel[previousModel.length - 2]).get(this.valueAttr);
        } else {
          total += model.get(this.valueAttr);
        }

        if (target <= model.get(this.pinTo)) {
          greaterThanTarget += model.get(this.valueAttr);
        }
      }, this);

      return targetPercent = targetPercent - (greaterThanTarget / total);
    },

    getPreviousValue: function () {
      return this.format(this.getTargetPercent() - this.getTargetPercent(true), 'percent');
    },

    render: function () {
      var content;
      content = '<span class="summary">' + this.getDateRange() + '</span>';
      content += '<' + this.valueTag + '>' + this.getValue() + '</' + this.valueTag + '>';
      content += '<p class="overview">' + this.getLabel() + '</p>';

      var decInc = (this.getTargetPercent() - this.getTargetPercent(true)) < 0 ? 'decrease' : 'increase';
      content += '<div class="delta"><span class="' + decInc + '">' + this.getPreviousValue() + '</span><span>on last week</span></div>';
      content += '<p class="overview">' + this.getPreviousDateRange() + '</p>';

      this.$el.html(content);

      this.getPreviousValue();
    },

    getLabel: function () {
      return 'processed within ' + this.target + ' working days';
    },

    getDateRange: function () {
      var presentMonth = _.last(this.collection.first().get('values'));

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
