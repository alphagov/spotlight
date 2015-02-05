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
            kpi = _.findWhere(aggregatedValues, {key: axisKey});

            if (kpi) {
              if (val) {
                kpi.value += val;
                if (model.get('number_of_transactions')) {
                  kpi.valueTimesVolume += (val * model.get('number_of_transactions'));
                  kpi.volume += model.get('number_of_transactions');
                  kpi.valueCount++;
                }
              }
            } else {
              aggregatedValues.push({
                key: axisKey,
                label: axis.label,
                isWeighted: true,
                value: val || 0,
                valueTimesVolume: (val * model.get('number_of_transactions')) || 0,
                volume: (val) ? model.get('number_of_transactions') : 0,
                valueCount: (val && model.get('number_of_transactions')) ? 1 : 0,
                format: {
                  type: axis.format.type || axis.format,
                  sigfigs: 3,
                  magnitude: true,
                  abbr: true
                }
              });
            }
          });
        });

        return this.applyWeightedAverages(aggregatedValues);
      },

      applyWeightedAverages: function (aggregatedValues) {

        var axes = this.options.axes.y;
        var kpi, weightedAverage;

        _.each(axes, function (axis) {
          kpi = _.findWhere(aggregatedValues, {key: axis.key});

          if (kpi) {
            if (axis.key === 'number_of_transactions' || axis.key === 'total_cost') {
              kpi.isWeighted = false;
              kpi.weighted_average = kpi.value;
            } else {
              if (kpi.volume) {
                weightedAverage = (kpi.valueTimesVolume / kpi.volume);
                kpi.weighted_average = parseFloat(weightedAverage.toFixed(1));
              }
            }
            kpi.allRowsHaveValues = (kpi.valueCount === this.length);
          }
        }, this);

        return aggregatedValues;
      }
    });

  });