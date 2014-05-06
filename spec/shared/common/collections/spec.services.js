define([
  'common/collections/services'
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
        var output = collection.alphabetise('C');
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
        var output = collection.alphabetise('ck');
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

      it('filters out services with "on-homepage" set to false', function () {
        collection.at(0).set('on-homepage', false);
        var output = collection.filterDashboards('transaction', 'service-group');
        expect(output).toEqual([
          { title: 'Duck', 'dashboard-type': 'transaction' },
          { title: 'Pig', 'dashboard-type': 'service-group' },
          { title: 'Sheep', 'dashboard-type': 'transaction' }
        ]);
      });

    });


  });
});