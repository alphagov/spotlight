define([
  'common/collections/dashboards'
],
function (Collection) {
  describe('Filtered List Collection', function () {

    var collection;
    var data = [
      { title: 'Sheep' },
      { title: 'Cow' },
      { title: 'Pig' },
      { title: 'Chicken' },
      { title: 'Duck' }
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

    describe('alphabetise', function () {

      it('groups by first letter', function () {

        var output = collection.alphabetise();

        expect(_.keys(output)).toEqual(['count', 'C', 'D', 'P', 'S']);
        expect(output.C).toEqual([
          { title: 'Chicken' },
          { title: 'Cow' }
        ]);
        expect(output.D).toEqual([
          { title: 'Duck' }
        ]);
        expect(output.P).toEqual([
          { title: 'Pig' }
        ]);
        expect(output.S).toEqual([
          { title: 'Sheep' }
        ]);

      });

      it('keeps a count of total entries', function () {
        var output = collection.alphabetise();
        expect(output.count).toEqual(5);
      });

      it('filters input based on string matching of a single character', function () {
        var output = collection.alphabetise({'text': 'C'});
        expect(output.count).toEqual(3);
        expect(output.C).toEqual([
          { title: 'Chicken' },
          { title: 'Cow' }
        ]);
        expect(output.D).toEqual([
          { title: 'Duck' }
        ]);
        expect(output.P).toBeUndefined();
        expect(output.S).toBeUndefined();
      });

      it('filters input based on string matching of multiple characters', function () {
        var output = collection.alphabetise({'text': 'ck'});
        expect(output.count).toEqual(2);
        expect(output.C).toEqual([
          { title: 'Chicken' },
        ]);
        expect(output.D).toEqual([
          { title: 'Duck' }
        ]);
        expect(output.P).toBeUndefined();
        expect(output.S).toBeUndefined();
      });

      it('filters input based on string matching against department title', function () {

        collection.reset([
          { title: 'Foo', department: { title: 'Department of Things', abbr: 'DoT' } },
          { title: 'Bar', department: { title: 'Department of Other Stuff', abbr: 'DoOS' } }
        ]);

        var output = collection.alphabetise({'text': 'thing'});
        expect(output.count).toEqual(1);
        expect(output.F).toEqual([
          { title: 'Foo', department: { title: 'Department of Things', abbr: 'DoT' } }
        ]);

      });

      it('filters input based on string matching against department abbreviation', function () {

        collection.reset([
          { title: 'Foo', department: { title: 'Department of Things', abbr: 'DoT' } },
          { title: 'Bar', department: { title: 'Department of Other Stuff', abbr: 'DoOS' } }
        ]);

        var output = collection.alphabetise({'text': 'doos'});
        expect(output.count).toEqual(1);
        expect(output.B).toEqual([
          { title: 'Bar', department: { title: 'Department of Other Stuff', abbr: 'DoOS' } }
        ]);

      });

      it('filters based on explicit department filter', function () {
        collection.reset([
          { title: 'Blood', department: { title: 'Department of Health', abbr: 'DH' } },
          { title: 'Passport', department: { title: 'Home Office', abbr: 'Home Office' } }
        ]);

        var output = collection.alphabetise({'department': 'home-office'});
        expect(output.count).toEqual(1);
        expect(output.P).toEqual([
          { title: 'Passport', department: { title: 'Home Office', abbr: 'Home Office' } }
        ]);
      });

    });

    describe('getDepartmentSlug', function () {
      it('lowercases the department abbreviation', function () {
        var department = { title: 'Cabinet Office', abbr: 'CO' };
        expect(collection.getDepartmentSlug(department)).toEqual('co');
      });

      it('turns spaces into hyphens', function () {
        var department = { title: 'Home Office', abbr: 'Home Office' };
        expect(collection.getDepartmentSlug(department)).toEqual('home-office');
      });
    });

    describe('filterDashboards', function () {

      var data = [
        { title: 'Sheep', 'dashboard-type': 'transaction' },
        { title: 'Cow', 'dashboard-type': 'high-volume-transaction' },
        { title: 'Pig', 'dashboard-type': 'service-group' },
        { title: 'Chicken', 'dashboard-type': 'transaction' },
        { title: 'Duck', 'dashboard-type': 'transaction' }
      ];

      beforeEach(function () {
        collection.reset(data);
      });

      it('filters the collection to only the dashboard types provided', function () {
        var output;
        output = collection.filterDashboards('service-group');
        expect(output).toEqual([
          { title: 'Pig', 'dashboard-type': 'service-group' }
        ]);

        output = collection.filterDashboards('transaction');
        expect(output).toEqual([
          { title: 'Chicken', 'dashboard-type': 'transaction' },
          { title: 'Duck', 'dashboard-type': 'transaction' },
          { title: 'Sheep', 'dashboard-type': 'transaction' }
        ]);
      });

      it('handles multiple values', function () {
        var output;
        output = collection.filterDashboards('service-group');
        expect(output).toEqual([
          { title: 'Pig', 'dashboard-type': 'service-group' }
        ]);

        output = collection.filterDashboards('transaction', 'service-group');
        expect(output).toEqual([
          { title: 'Chicken', 'dashboard-type': 'transaction' },
          { title: 'Duck', 'dashboard-type': 'transaction' },
          { title: 'Pig', 'dashboard-type': 'service-group' },
          { title: 'Sheep', 'dashboard-type': 'transaction' }
        ]);
      });

      it('handles an array as the first argument', function () {
        var output;
        output = collection.filterDashboards(['service-group']);
        expect(output).toEqual([
          { title: 'Pig', 'dashboard-type': 'service-group' }
        ]);
      });

    });


  });
});
