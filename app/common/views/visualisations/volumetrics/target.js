define([
  'common/views/visualisations/volumetrics/number',
  'client/views/graph/missing-data',
  'extensions/models/model'
],
function (NumberView, MissingData, Model) {
  var TargetNumberView = NumberView.extend({

    getValue: function () {
      var value = this.getTargetPercent();

      if (_.isNumber(value) && _.isFinite(value)) {
        return this.format(value, 'percent');
      }

      return false;
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

          if (_.isNumber(target) && target < model.get(this.pinTo)) {
            greaterThanTarget += previousModelValue;
          }
        } else {
          total += model.get(this.valueAttr);

          if (_.isNumber(target) && target < model.get(this.pinTo)) {
            greaterThanTarget += model.get(this.valueAttr);
          }
        }
      }, this);

      return targetPercent - (greaterThanTarget / total);
    },

    percentageDifference: function () {
      return this.format(this.getTargetPercent() - this.getTargetPercent(true), 'percent');
    },

    render: function () {
      if (this.collection.isEmpty()) {
        this.missingData = new MissingData({
          el: this.$el
        });
        this.missingData.render();
        return;
      } else {
        var value = this.getValue();
        var stat = value ?
          '<div class="stat"><' + this.valueTag + '>' + this.getValue() + '</' + this.valueTag + '></div>'
          : '<div class="stat no-data"><' + this.valueTag + '>no data</' + this.valueTag + '></div>';
        var content = '';

        if (_.isNumber(this.target)) {
          content += '<span class="summary">' + this.getDateRange() + '</span>';
        }

        content += stat;

        if (_.isString(this.target)) {
          content += '<span class="period">' + this.getDateRange() + '</span>';
        }

        content += '<p class="overview">' + this.getLabel() + '</p>';

        var percentageChange = this.getTargetPercent() - this.getTargetPercent(true);
        var decInc = percentageChange < 0 ? 'decrease' : 'increase';
        if (percentageChange === 0 || !_.isFinite(percentageChange)) {
          content += '<div class="delta"><span class="no-change">no change </span><span>on last week</span></div>';
        } else {
          content += '<div class="delta"><span class="' + decInc + '">' + this.percentageDifference() + '</span> <span>on last week</span></div>';
        }

        content += '<p class="overview">' + this.getPreviousDateRange() + '</p>';

        this.$el.html(content);
      }
    },

    getLabel: function () {
      var label = '';
      if (_.isNumber(this.target) && this.getValue()) {
        label += 'processed within ' + this.target + ' working days';
      }

      return label;
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
