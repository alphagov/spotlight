define([
    'common/collections/dashboards'
  ],
  function (Collection) {
    describe('Filtered List Collection', function () {

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
      });

      describe('filterServices', function () {
        var data = [
          {
            title: 'Prescriptions: prepayment certificates issued',
            'department': {
              'title': 'Department of Health',
              'abbr': 'DH'
            },
            agency: {
              title: 'NHS Business Services Authority',
              abbr: 'NHSBSA'
            }
          },
          {
            'title': 'Written GP referrals to first outpatient appointment',
            'department': {
              'title': 'Department of Health',
              'abbr': 'DH'
            },
            'agency': {
              'title': 'NHS England',
              'abbr': 'NHS England'
            }
          },
          {
            'title': 'Job search adviser interventions',
            'department': {
              'title': 'Department for Work and Pensions',
              'abbr': 'DWP'
            }
          }
        ];

        beforeEach(function () {
          collection.reset(data);
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
          expect(models.length).toEqual(1);
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
