define([
  'common/views/visualisations/grouped-graph/stacked-graph',
  'common/collections/grouped_timeseries',
  'extensions/views/graph/stack-set',
  'extensions/views/graph/stacked-linelabel',
  'extensions/views/graph/graph',
  'extensions/models/model'
],
function (StackedGraph, Collection, StackSet, StackedLineLabel, Graph, Model) {
  describe('StackedGraph', function () {

    var graph, model, collection, data;
    beforeEach(function () {
      spyOn(Graph.prototype, 'initialize').andCallThrough();
      model = new Model({
        'value-attribute': 'someAttr',
        axes: {
          y: [
            { label: 'Label1', categoryId: 'croydon' },
            { label: 'Label2', categoryId: 'hackney' },
            { label: 'Label3', categoryId: 'westminster' }
          ]
        }
      });
      collection = new Collection([], {
        axes: model.get('axes'),
        category: 'id',
        valueAttr: '_count'
      });
      graph = new StackedGraph({
        collection: collection,
        model: model,
        valueAttr: '_count'
      });

      data = {
        data: [
          {
            id: 'westminster',
            title: 'Westminster',
            values: [
              {
                _start_at: '2013-01-14',
                _end_at: '2013-01-21',
                _count: 1,
                alternativeValue: 100
              },
              {
                _start_at: '2013-01-21',
                _end_at: '2013-01-28',
                _count: 6,
                alternativeValue: 99
              },
              {
                _start_at: '2013-01-28',
                _end_at: '2013-02-04',
                _count: 11,
                alternativeValue: 98
              }
            ]
          },
          {
            id: 'croydon',
            title: 'Croydon',
            values: [
              {
                _start_at: '2013-01-14',
                _end_at: '2013-01-21',
                _count: 2,
                alternativeValue: 80
              },
              {
                _start_at: '2013-01-21',
                _end_at: '2013-01-28',
                _count: 7,
                alternativeValue: 87
              },
              {
                _start_at: '2013-01-28',
                _end_at: '2013-02-04',
                _count: 12,
                alternativeValue: 23
              }
            ]
          },
          {
            id: 'hackney',
            title: 'Hackney',
            values: [
              {
                _start_at: '2013-01-14',
                _end_at: '2013-01-21',
                _count: 5,
                alternativeValue: 110
              },
              {
                _start_at: '2013-01-21',
                _end_at: '2013-01-28',
                _count: 12,
                alternativeValue: 40
              },
              {
                _start_at: '2013-01-28',
                _end_at: '2013-02-04',
                _count: 9,
                alternativeValue: 50
              }
            ]
          }
        ]
      };
    });

    describe('components', function () {

      it('should include a stacked linelabel component when showLineLabels is truthy', function () {
        model.set({ 'show-line-labels': true });
        var labelComponent = graph.components().linelabel.view;
        expect(labelComponent).toEqual(StackedLineLabel);
      });

      it('should include a stack-set component', function () {
        var stackset = graph.components().lines.view;
        expect(stackset).toEqual(StackSet);
      });

    });

    describe('getYPos', function () {

      beforeEach(function () {
        collection.reset(data, { parse: true });
        spyOn(graph, 'getY0Pos').andReturn(10);
      });

      it('adds the baseline position to the model value', function () {
        var output = graph.getYPos(0, 'westminster:_count');
        expect(graph.getY0Pos).toHaveBeenCalledWith(0, 'westminster:_count');
        expect(output).toEqual(11);
      });

      it('returns null if model value is null', function () {
        collection.at(0).set('westminster:_count', null);
        var output = graph.getYPos(0, 'westminster:_count');
        expect(output).toEqual(null);
      });

    });

    describe('getY0Pos', function () {

      beforeEach(function () {
        collection.reset(data, { parse: true });
        spyOn(Graph.prototype, 'getYPos').andCallThrough();
      });

      it('sums the values for subsequent stacks', function () {
        var output = graph.getY0Pos(0, 'croydon:_count');
        expect(Graph.prototype.getYPos).toHaveBeenCalledWith(0, 'westminster:_count');
        expect(Graph.prototype.getYPos).toHaveBeenCalledWith(0, 'hackney:_count');
        expect(output).toEqual(6);

        Graph.prototype.getYPos.reset();

        output = graph.getY0Pos(2, 'hackney:_count');
        expect(Graph.prototype.getYPos).not.toHaveBeenCalledWith(2, 'croydon:_count');
        expect(Graph.prototype.getYPos).toHaveBeenCalledWith(2, 'westminster:_count');
        expect(output).toEqual(11);
      });

      it('returns zero for the last stack', function () {
        var output = graph.getY0Pos(0, 'westminster:_count');
        expect(Graph.prototype.getYPos).not.toHaveBeenCalled();
        expect(output).toEqual(0);
      });

    });

    describe('calcYScale', function () {

      beforeEach(function () {

        collection.reset(data, { parse: true });
        collection.getCurrentSelection = jasmine.createSpy().andReturn({});
        graph.innerWidth = 444;
        graph.innerHeight = 333;

      });

      it('scales domain from 0 to nice value above max value', function () {
        expect(graph.calcYScale().domain()).toEqual([0, 35]);
      });

      it('scales domain from 0 to nice value above max value when an alternative value attribute is used', function () {
        graph.valueAttr = 'alternativeValue';
        collection.valueAttr = 'alternativeValue';
        collection.reset(data, { parse: true });
        expect(graph.calcYScale().domain()).toEqual([0, 300]);
      });

      it('scales range to inner height', function () {
        expect(graph.calcYScale().range()).toEqual([333, 0]);
      });

      it('sets the tick values correctly', function () {
        expect(graph.calcYScale().tickValueList)
            .toEqual([ 0, 5, 10, 15, 20, 25, 30, 35 ]);
      });

      it('scales domain from 0 to nice value above maximum sum of point in time when an alternative value attribute is used', function () {
        graph.valueAttr = 'alternativeValue';
        collection.valueAttr = 'alternativeValue';
        collection.reset(data, { parse: true });
        expect(graph.calcYScale().domain()).toEqual([0, 300]);
      });

    });


  });
});
