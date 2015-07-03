define([
    'common/collections/dashboards'
  ],
  function (Dashboard) {
    return Dashboard.extend({
      getAggregateValues: function () {
        var aggregatedValues = [];
        var axes = this.options.axes.y;
        var kpi;

        _.each(this.models, function (model) {
          _.each(axes, function (axis) {
            var axisKey = axis.key;
            var val = model.get(axisKey);
            var number_of_transactions = model.get('number_of_transactions');
            kpi = _.findWhere(aggregatedValues, {key: axisKey});

            if (kpi) {
              if (val && number_of_transactions) {
                kpi.value += val;
                kpi.valueTimesVolume += (val * model.get('number_of_transactions'));
                // if the axisKey is total_cost then this has this potential
                // to be undefined + n which is NaN but total_cost is not weighted so this
                // shouldn't matter.
                kpi.volume += model.get('number_of_transactions');
                kpi.valueCount++;
              } else if (val && axisKey === 'total_cost') {
                kpi.value += val;
                kpi.valueTimesVolume += val;
                kpi.valueCount++;
              }
            } else {
              if ((val || val === 0) && number_of_transactions) {
                aggregatedValues.push({
                  key: axisKey,
                  label: axis.label,
                  isWeighted: true,
                  value: val,
                  valueTimesVolume: val * number_of_transactions,
                  volume: number_of_transactions,
                  valueCount: 1,
                  format: {
                    type: axis.format.type || axis.format,
                    sigfigs: 3,
                    magnitude: true,
                    abbr: true
                  }
                });
              } else if ((val || val === 0) && axisKey === 'total_cost') {
                // Total cost is a special case - it does not need
                // number_of_transactions as it doesn't get weighted.
                aggregatedValues.push({
                  key: axisKey,
                  label: axis.label,
                  isWeighted: true,
                  value: val,
                  valueTimesVolume: val,
                  volume: undefined,
                  valueCount: 1,
                  format: {
                    type: axis.format.type || axis.format,
                    sigfigs: 3,
                    magnitude: true,
                    abbr: true
                  }
                });
              }
            }
          });
        });

        return this.applyWeightedAverages(aggregatedValues);
      },

      applyWeightedAverages: function (aggregatedValues) {

        var axes = this.options.axes.y;
        var kpi, weightedAverage;

        _.each(axes, function (axis) {
          var decimalPlaces;
          kpi = _.findWhere(aggregatedValues, {key: axis.key});

          if (kpi) {
            if (axis.key === 'number_of_transactions' || axis.key === 'total_cost') {
              kpi.isWeighted = false;
              kpi.weighted_average = kpi.value;
            } else {
              if (kpi.volume) {
                decimalPlaces = (kpi.format.type === 'percent') ? 3 : 1;
                weightedAverage = (kpi.valueTimesVolume / kpi.volume);
                kpi.weighted_average = parseFloat(weightedAverage.toFixed(decimalPlaces));
              }
            }
            kpi.allRowsHaveValues = (kpi.valueCount === this.length);
          }
        }, this);

        return aggregatedValues;
      }
    });

  });
