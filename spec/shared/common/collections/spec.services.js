define([
    'common/collections/services'
  ],
  function (Collection) {
    describe('Services Collection', function () {

      var servicesAxes = {
        axes: {
          x: {
            key: 'titleLink',
            label: 'Transaction name'
          },
          y: [
            {
              key: 'number_of_transactions',
              label: 'Transactions per year',
              format: 'integer'
            },
            {
              key: 'total_cost',
              label: 'Cost per year',
              format: 'currency'
            },
            {
              label: 'Cost per transaction',
              key: 'cost_per_transaction',
              format: 'currency'
            },
            {
              label: 'Digital take-up',
              key: 'digital_takeup',
              format: 'percent'
            },
            {
              label: 'User satisfaction',
              key: 'user_satisfaction_score',
              format: 'percent'
            },
            {
              label: 'Completion rate',
              key: 'completion_rate',
              format: 'percent'
            }
          ]
        }
      };

      var dashboardData = [
        {
          title: 'Prescriptions: prepayment certificates issued',
          department: {
            title: 'Department of Health',
            abbr: 'DH'
          },
          agency: {
            title: 'NHS Business Services Authority',
            abbr: 'NHSBSA'
          },
          total_cost: 11121,
          number_of_transactions: 2000,
          cost_per_transaction: 19.4,
          digital_takeup: 0.2,
          completion_rate: 0.4,
          user_satisfaction_score: 0.9
        },
        {
          title: 'Written GP referrals to first outpatient appointment',
          department: {
            title: 'Department of Health',
            abbr: 'DH'
          },
          agency: {
            title: 'NHS England',
            abbr: 'NHS England'
          },
          total_cost: 800,
          number_of_transactions: 1000,
          cost_per_transaction: 0.8,
          digital_takeup: 0.9,
          completion_rate: 0.3,
          user_satisfaction_score: 0.40
        },
        {
          title: 'Job search adviser interventions',
          department: {
            title: 'Department for Work and Pensions',
            abbr: 'DWP'
          },
          total_cost: 400,
          number_of_transactions: 900,
          cost_per_transaction: 0.44,
          digital_takeup: 0.3,
          completion_rate: 0.2,
          user_satisfaction_score: 0.3
        },
        {
          label: 'blah',
          department: {
            title: 'Department for Work and Pensions',
            abbr: 'DWP'
          },
          total_cost: null,
          number_of_transactions: null,
          cost_per_transaction: null,
          digital_takeup: null,
          completion_rate: null,
          user_satisfaction_score: null
        }
      ];

      describe('getAggregateValues()', function () {

        beforeEach(function () {
          this.collection = new Collection(dashboardData, servicesAxes);
        });

        it('returns an array of aggregated values for the collection', function () {
          var aggregateValues = this.collection.getAggregateValues(),
            completion_rate = aggregateValues[aggregateValues.length - 1],
            total_cost = aggregateValues[1];

          expect(aggregateValues.length).toEqual(6);

          expect(completion_rate.label).toEqual('Completion rate');
          expect(completion_rate.value).toBeCloseTo(0.9);
          expect(completion_rate.valueCount).toEqual(3);
          expect(completion_rate.format).toEqual(
            {
              type: 'percent',
              sigfigs: 3,
              magnitude: true,
              abbr: true
            });

          expect(total_cost.label).toEqual('Cost per year');
          expect(total_cost.value).toBeCloseTo(12321);
          expect(total_cost.valueCount).toEqual(3);
          expect(total_cost.format).toEqual(
            {
              type: 'currency',
              sigfigs: 3,
              magnitude: true,
              abbr: true
            });
        });

      });

      describe('applyWeightedAverages', function () {
        var weightedAverages;

        beforeEach(function () {
          this.collection = new Collection(dashboardData, servicesAxes);
          weightedAverages = this.collection.applyWeightedAverages([{
            'key': 'digital_takeup',
            'label': 'Digital take-up',
            'isWeighted': true,
            'value': 1.8901081855159454,
            'valueTimesVolume': 1324601.0754938435,
            'volume': 1369650,
            'valueCount': 2,
            'format': {
              'type': 'percent',
              'sigfigs': 3,
              'magnitude': true,
              'abbr': true
            }
          },
            {
              key: 'user_satisfaction_score',
              label: 'User satisfaction',
              isWeighted: true,
              value: 1.6,
              valueTimesVolume: 2470,
              volume: 3900,
              valueCount: 3,
              format: {
                type: 'percent',
                sigfigs: 3,
                magnitude: true,
                abbr: true
              }
            },
            {
              key: 'completion_rate',
              label: 'Completion rate',
              isWeighted: true,
              value: 0.9000000000000001,
              valueTimesVolume: 1280,
              volume: 3900,
              valueCount: 3,
              format: {
                type: 'percent',
                sigfigs: 3,
                magnitude: true,
                abbr: true
              }
            },
            {
              key: 'number_of_transactions',
              label: 'Transactions per year',
              isWeighted: true,
              value: 3900,
              valueTimesVolume: 5810000,
              volume: 3900,
              valueCount: 3,
              format: {
                type: 'integer',
                sigfigs: 3,
                magnitude: true,
                abbr: true
              }
            },
            {
              key: 'total_cost',
              label: 'Cost per year',
              isWeighted: true,
              value: 12321,
              valueTimesVolume: 23402000,
              volume: 3900,
              valueCount: 3,
              format: {
                type: 'currency',
                sigfigs: 3,
                magnitude: true,
                abbr: true
              }
            },
            {
              key: 'cost_per_transaction',
              label: 'Cost per transaction',
              isWeighted: true,
              value: 20.64,
              valueTimesVolume: 39996,
              volume: 3900,
              valueCount: 3,
              format: {
                type: 'currency',
                sigfigs: 3,
                magnitude: true,
                abbr: true
              }
            }]);
        });

        it('returns a weighted average for each metric', function () {
          var cost_per_transaction = weightedAverages[5],
            digital_takeup = weightedAverages[0];

          expect(cost_per_transaction.weighted_average).toEqual(10.3);
          expect(digital_takeup.weighted_average).toBeCloseTo(0.97);
        });

        it('sets the weighted_average to be the total value for number_of_transactions', function () {
          var number_of_transactions = weightedAverages[3];

          expect(number_of_transactions.weighted_average).toEqual(number_of_transactions.value);
          expect(number_of_transactions.isWeighted).toBe(false);
        });
      });


    });
  });
