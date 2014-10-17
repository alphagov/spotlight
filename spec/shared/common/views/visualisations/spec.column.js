define([
  'extensions/views/view',
  'common/views/visualisations/column',
  'extensions/collections/collection'
], function (BaseView, ColumnView, Collection) {
  describe('ColumnView', function () {

    var view, collection;

    beforeEach(function () {
      spyOn(BaseView.prototype, 'initialize');
      spyOn(ColumnView.prototype, 'pinCollection').andCallThrough();
      spyOn(ColumnView.prototype, 'addCollectionLabels').andCallThrough();

      collection = new Collection(
        [
          {
            name: 0,
            test: 1
          },
          {
            name: 1,
            test: 1
          },
          {
            name: 2,
            test: 1
          },
          {
            name: 3,
            test: 1
          },
          {
            name: 4,
            test: 1
          },
          {
            name: 5,
            test: 1
          },
          {
            name: 6,
            test: 1
          },
          {
            name: 7,
            test: 1
          },
          {
            name: 8,
            test: 1
          },
          {
            name: 9,
            test: 1
          }
        ],
        {
        valueAttr: 'test',
        axes: {
          x: {
            key: 'name'
          }
        },
        pinTo: 'name'
      });

      view = new ColumnView({
        collection: collection
      });
    });

    afterEach(function () {
      view.remove();
    });

    describe('initialize()', function () {

      it('calls the BaseView initialize()', function () {
        expect(BaseView.prototype.initialize).toHaveBeenCalled();
      });

      it('calls pinCollection()', function () {
        expect(view.pinCollection).toHaveBeenCalled();
      });

      it('calls addCollectionLabels()', function () {
        expect(view.addCollectionLabels).toHaveBeenCalled();
      });

    });

    describe('pinCollection()', function () {
      it('sets the collection length to "max-bars"', function () {
        expect(view.collection.length).toBe(10);

        view.maxBars = 2;
        view.pinCollection();

        expect(view.collection.length).toBe(2);
      });

      it('adds all models greater than "max-bars" to the "max-bar"', function () {
        view.maxBars = 2;
        view.pinCollection();

        expect(view.collection.at(1)
          .get(view.collection.options.valueAttr)).toBe(9);
      });

      it('removes all models greater than "max-bars"', function () {
        expect(view.collection.at(4)).toBeDefined();

        view.maxBars = 4;
        view.pinCollection();

        expect(view.collection.length).toBe(4);
        expect(view.collection.at(4)).toBe(undefined);
        expect(view.collection.at(5)).toBe(undefined);
        expect(view.collection.at(6)).toBe(undefined);
        expect(view.collection.at(7)).toBe(undefined);
        expect(view.collection.at(8)).toBe(undefined);
        expect(view.collection.at(9)).toBe(undefined);
      });

      it('adds a "+" to the "max-bar" model title', function () {
        view.maxBars = 4;
        view.pinCollection();

        expect(view.collection.at(3).get('title')).toBe('3+');
      });

      it('doesnt do anything to the collection if the maxBars attribute is greater than the collection length', function () {
        expect(view.collection.length).toBe(10);

        view.maxBars = 20;
        view.pinCollection();

        expect(view.collection.length).toBe(10);
      });
    });

    describe('addCollectionLabels()', function () {
      it('adds a title attribute of pinTo key to the collection for the bar chart', function () {
        view.addCollectionLabels();

        expect(view.collection.at(0).get('title')).toBe('0');
        expect(view.collection.at(1).get('title')).toBe('1');
        expect(view.collection.at(2).get('title')).toBe('2');
        expect(view.collection.at(3).get('title')).toBe('3');
        expect(view.collection.at(4).get('title')).toBe('4');
        expect(view.collection.at(5).get('title')).toBe('5');
        expect(view.collection.at(6).get('title')).toBe('6');
        expect(view.collection.at(7).get('title')).toBe('7');
        expect(view.collection.at(8).get('title')).toBe('8');
        expect(view.collection.at(9).get('title')).toBe('9');
      });

      it('adds a + is isPinned is true', function () {
        view.addCollectionLabels(true);

        expect(view.collection.at(0).get('title')).toBe('0');
        expect(view.collection.at(1).get('title')).toBe('1');
        expect(view.collection.at(2).get('title')).toBe('2');
        expect(view.collection.at(3).get('title')).toBe('3');
        expect(view.collection.at(4).get('title')).toBe('4');
        expect(view.collection.at(5).get('title')).toBe('5');
        expect(view.collection.at(6).get('title')).toBe('6');
        expect(view.collection.at(7).get('title')).toBe('7');
        expect(view.collection.at(8).get('title')).toBe('8');
        expect(view.collection.at(9).get('title')).toBe('9+');
      });
    });

  });

});
