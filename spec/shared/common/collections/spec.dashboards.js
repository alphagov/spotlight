define([
    'common/collections/dashboards'
  ],
  function (Collection) {
    describe('Dashboard Collection', function () {

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
          service: {
            title: 'Service 1',
            abbr: 'S1',
            slug: 'prepayment'
          },
          slug: 'prepayment-certificates',
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
          service: {
            title: 'Service 2',
            abbr: 'S2',
            slug: 'referrals'
          },
          slug: 'dh-written-gp-referrals-to-first-outpatient-appointment',
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
          title: 'blah',
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

      var collection;
      var data = [
        {title: 'Sheep'},
        {title: 'Cow'},
        {title: 'Pig'},
        {title: 'Chicken'},
        {title: 'Duck'}
      ];

      beforeEach(function () {
        collection = new Collection(data);
      });

      it('sorts by title', function () {
        expect(collection.at(0).get('title')).toEqual('Chicken');
        expect(collection.at(1).get('title')).toEqual('Cow');
        expect(collection.at(2).get('title')).toEqual('Duck');
        expect(collection.at(3).get('title')).toEqual('Pig');
        expect(collection.at(4).get('title')).toEqual('Sheep');
      });

      describe('getSlug', function () {
        it('lowercases the abbreviation if possible', function () {
          var department = {title: 'Cabinet Office', abbr: 'CO'};
          expect(collection.getSlug(department)).toEqual('co');
        });

        it('turns spaces into hyphens', function () {
          var department = {title: 'Home Office', abbr: 'Home Office'};
          expect(collection.getSlug(department)).toEqual('home-office');
        });

        it('uses the title if no abbreviation is provided', function () {
          var department = {title: 'Skills Funding Agency'};
          expect(collection.getSlug(department)).toEqual('skills-funding-agency');
        });

        it('returns unknown-organisation if no useful information is provided', function () {
          var department = {foo: 'bar'};
          expect(collection.getSlug(department)).toEqual('unknown-organisation');
        });

        it('doesn\'t override the existing slug for services', function() {
          collection.reset(dashboardData);
          expect(collection.getServices()[1].slug).toEqual('referrals');
        });

      });

      describe('filterServices', function () {
        beforeEach(function () {
          collection.reset(dashboardData);
        });

        it('filters the collection using a combination of search string and dept', function () {
          var filter = {
              text: 'GP',
              department: 'dh'
            },
            models = collection.filterServices(filter);
          expect(models[0].get('title')).toEqual('Written GP referrals to first outpatient appointment');
        });

        it('filters on search string only', function () {
          var filter = {
              text: 'health'
            },
            models;
          models = collection.filterServices(filter);
          expect(models.length).toEqual(2);
          expect(models[0].get('title')).toEqual('Prescriptions: prepayment certificates issued');
          expect(models[1].get('title')).toEqual('Written GP referrals to first outpatient appointment');
        });

        it('filters on agency only', function () {
          var filter = {
              department: 'agency:nhsbsa'
            },
            models;
          models = collection.filterServices(filter);
          expect(models.length).toEqual(1);
          expect(models[0].get('title')).toEqual('Prescriptions: prepayment certificates issued');
        });

        it('filters on department only', function () {
          var filter = {
              department: 'dwp'
            },
            models;
          models = collection.filterServices(filter);
          expect(models.length).toEqual(2);
          expect(models[0].get('title')).toEqual('Job search adviser interventions');
        });

      });

      describe('filterDashboards', function () {

        var data = [
          {title: 'Sheep', 'dashboard-type': 'transaction'},
          {title: 'Cow', 'dashboard-type': 'high-volume-transaction'},
          {title: 'Pig', 'dashboard-type': 'service-group'},
          {title: 'Chicken', 'dashboard-type': 'transaction'},
          {title: 'Duck', 'dashboard-type': 'transaction'}
        ];

        beforeEach(function () {
          collection.reset(data);
        });

        it('filters the collection to only the dashboard types provided', function () {
          var output;
          output = collection.filterDashboards('service-group');
          expect(output).toEqual([
            {title: 'Pig', 'dashboard-type': 'service-group'}
          ]);

          output = collection.filterDashboards('transaction');
          expect(output).toEqual([
            {title: 'Chicken', 'dashboard-type': 'transaction'},
            {title: 'Duck', 'dashboard-type': 'transaction'},
            {title: 'Sheep', 'dashboard-type': 'transaction'}
          ]);
        });

        it('handles multiple values', function () {
          var output;
          output = collection.filterDashboards('service-group');
          expect(output).toEqual([
            {title: 'Pig', 'dashboard-type': 'service-group'}
          ]);

          output = collection.filterDashboards('transaction', 'service-group');
          expect(output).toEqual([
            {title: 'Chicken', 'dashboard-type': 'transaction'},
            {title: 'Duck', 'dashboard-type': 'transaction'},
            {title: 'Pig', 'dashboard-type': 'service-group'},
            {title: 'Sheep', 'dashboard-type': 'transaction'}
          ]);
        });

        it('handles an array as the first argument', function () {
          var output;
          output = collection.filterDashboards(['service-group']);
          expect(output).toEqual([
            {title: 'Pig', 'dashboard-type': 'service-group'}
          ]);
        });

      });
    });
  });
