define([
  'common/views/visualisations/bar-chart/bar-chart',
  'common/collections/journey',
  'extensions/collections/collection'
],
function (BarChart, JourneyCollection, Collection) {

  describe('BarChart', function () {
    var graph;

    beforeEach(function () {
      graph = new BarChart({
        collection: new JourneyCollection([{}]),
        formatOptions: { 'type': 'integer', 'magnitude': 'true' }
      });
    });

    describe('calcXScale', function () {
      it('sets the domain to the number of steps', function () {

        graph.collection.at(0).set('values', new Collection([
          { uniqueEvents: 100 },
          { uniqueEvents: 100 },
          { uniqueEvents: 100 }
        ]));
        expect(graph.calcXScale().domain()).toEqual([0, 2]);

        graph.collection.at(0).set('values', new Collection([
          { uniqueEvents: 100 },
          { uniqueEvents: 100 },
          { uniqueEvents: 100 },
          { uniqueEvents: 100 }
        ]));
        expect(graph.calcXScale().domain()).toEqual([0, 3]);
      });
    });

    describe('calcYScale', function () {
      it('sets the domain to the range of the data', function () {
        graph.collection.at(0).set('values', new Collection([
          { uniqueEvents: 300 },
          { uniqueEvents: 200 },
          { uniqueEvents: 100 }
        ]));
        expect(graph.calcYScale().domain()).toEqual([0, 300]);
      });

      it('calculates data range based on valueAttr property', function () {
        graph.valueAttr = 'otherEvent';
        graph.collection.at(0).set('values', new Collection([
          { uniqueEvents: 300, otherEvent: 20 },
          { uniqueEvents: 200, otherEvent: 10 },
          { uniqueEvents: 100, otherEvent: 0 }
        ]));
        expect(graph.calcYScale().domain()).toEqual([0, 20]);
      });

      it('defaults domain to [0, 1] if no data is available', function () {
        graph.collection.at(0).set('values', new Collection([]));
        expect(graph.calcYScale().domain()).toEqual([0, 1]);
      });
    });

    describe('getYPos', function () {
      it('returns 0 if model data is undefined', function () {
        spyOn(graph.configs.overlay, 'getYPos');
        expect(graph.getYPos(0, 0)).toEqual(0);
      });
    });

  });

});
