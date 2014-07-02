define([
  'common/views/visualisations/grouped-graph/stacked-graph',
  'extensions/collections/collection',
  'extensions/views/graph/stack',
  'extensions/views/graph/stacked-linelabel',
  'extensions/views/graph/callout',
  'extensions/views/graph/graph',
  'extensions/models/model'
],
function (StackedGraph, Collection, Stack, LineLabel, Callout, Graph, Model) {
  xdescribe('StackedGraph', function () {

    var graph;
    beforeEach(function () {
      spyOn(Graph.prototype, 'initialize').andCallThrough();
      var model = new Model({
        'value-attribute': 'someAttr'
      });
      graph = new StackedGraph({
        collection: new Collection(),
        model: model
      });
    });

    describe('interactiveFunction', function () {
      describe('if graph.lineLabelOnTop() is truthy', function () {
        beforeEach(function () {
          graph.graph = {
            lineLabelOnTop: function () {
              return true;
            }
          };
        });
        it('returns true when the passed in object.slice is >= 3', function () {
          expect(graph.interactiveFunction({slice: 3})).toEqual(true);
        });
        it('returns false when the passed in object.slice is < 3', function () {
          expect(graph.interactiveFunction({slice: 2})).toEqual(false);
        });
      });
      describe('if graph.lineLabelOnTop() is falsy', function () {
        beforeEach(function () {
          graph.graph = {
            lineLabelOnTop: function () {
              return false;
            }
          };
        });
        it('returns true when the passed in object.slice % 3 is !== 2', function () {
          expect(graph.interactiveFunction({slice: 3})).toEqual(true);
        });
        it('returns false when the passed in object.slice % 3 is == 2', function () {
          expect(graph.interactiveFunction({slice: 5})).toEqual(false);
        });
      });
    });

    describe('components', function () {
      describe('when showLineLabels is truthy', function () {
        it('should return the stack component with the correct args on initialize', function () {
          var model = new Model({
            'show-line-labels': true
          });
          graph = new StackedGraph({
            collection: new Collection(),
            model: model
          });
          var stackComponent = graph.components().stack['view'];
          var stackOptions = graph.components().stack['options'];
          expect(stackOptions).not.toBeUndefined();
          expect(stackComponent).toEqual(Stack);
        });
      });
      describe('when showLineLabels is falsy', function () {
        it('should return the stack component with the correct args on initialize', function () {
          var stackComponent = graph.components().stack['view'];
          var stackOptions = graph.components().stack['options'];
          expect(stackOptions).toBeUndefined();
          expect(stackComponent).toEqual(Stack);
        });
      });

      describe('when showLineLabels is truthy', function () {
        it('should return the linelabel component with the correct args on initialize', function () {
          var model = new Model({
            'show-line-labels': true,
            'line-label-links': true
          });
          graph = new StackedGraph({
            collection: new Collection(),
            model: model
          });
          var labelComponent = graph.components().label['view'];
          var labelOptions = graph.components().label['options'];
          expect(labelOptions).toEqual({
            showValues: true,
            showValuesPercentage: true,
            showSummary: true,
            showTimePeriod: true,
            attachLinks: model.get('line-label-links')
          });
          expect(labelComponent).toEqual(LineLabel);
        });
      });
      describe('when showLineLabels is falsy', function () {
        it('should return the callout component with the correct args on initialize', function () {
          var labelComponent = graph.components().label['view'];
          var labelOptions = graph.components().label['options'];
          expect(labelOptions).toBeUndefined();
          expect(labelComponent).toEqual(Callout);
        });
      });
    });

    describe('getYPos', function () {
      describe('if there is nothing at the index', function () {
        describe('if there is something at the previous index', function () {
          beforeEach(function () {
            graph.collection = {
              at: function (index) {
                if (index === 4) {
                  return true;
                } else {
                  return null;
                }
              }
            };
          });
          describe('if encompassStack is true', function () {
            beforeEach(function () {
              graph.encompassStack = true;
            });
            it('returns 0', function () {
              expect(graph.getYPos(5)).toEqual(0);
            });
          });
          describe('if encompassStack is false', function () {
            beforeEach(function () {
              graph.encompassStack = false;
            });
            it('returns null', function () {
              expect(graph.getYPos(5)).toEqual(null);
            });
          });
        });
        describe('if there is nothing at the previous index', function () {
          beforeEach(function () {
            graph.collection = {
              at: function () {
                return null;
              }
            };
          });
          it('returns null', function () {
            expect(graph.getYPos(5)).toEqual(null);
          });
        });
      });
    });

    describe('calculation', function () {
      var collection, graph;
      beforeEach(function () {

        spyOn(Graph.prototype, 'render');

        collection = new Collection();

        collection.reset([
          {
            id: 'total',
            title: 'Total applications',
            values: new Collection([
              {
                _start_at: collection.getMoment('2013-01-14').startOf('day'),
                _end_at: collection.getMoment('2013-01-21').startOf('day'),
                _count: 90,
                alternativeValue: 444
              },
              {
                _start_at: collection.getMoment('2013-01-21').startOf('day'),
                _end_at: collection.getMoment('2013-01-28').startOf('day'),
                _count: 100,
                alternativeValue: 333
              },
              {
                _start_at: collection.getMoment('2013-01-28').startOf('day'),
                _end_at: collection.getMoment('2013-02-04').startOf('day'),
                _count: 114,
                alternativeValue: 222
              }
            ])
          },
          {
            id: 'westminster',
            title: 'Westminster',
            values: new Collection([
              {
                _start_at: collection.getMoment('2013-01-14').startOf('day'),
                _end_at: collection.getMoment('2013-01-21').startOf('day'),
                _count: 1,
                alternativeValue: 100
              },
              {
                _start_at: collection.getMoment('2013-01-21').startOf('day'),
                _end_at: collection.getMoment('2013-01-28').startOf('day'),
                _count: 6,
                alternativeValue: 99
              },
              {
                _start_at: collection.getMoment('2013-01-28').startOf('day'),
                _end_at: collection.getMoment('2013-02-04').startOf('day'),
                _count: 11,
                alternativeValue: 98
              }
            ])
          },
          {
            id: 'croydon',
            title: 'Croydon',
            values: new Collection([
              {
                _start_at: collection.getMoment('2013-01-14').startOf('day'),
                _end_at: collection.getMoment('2013-01-21').startOf('day'),
                _count: 2,
                alternativeValue: 80
              },
              {
                _start_at: collection.getMoment('2013-01-21').startOf('day'),
                _end_at: collection.getMoment('2013-01-28').startOf('day'),
                _count: 7,
                alternativeValue: 87
              },
              {
                _start_at: collection.getMoment('2013-01-28').startOf('day'),
                _end_at: collection.getMoment('2013-02-04').startOf('day'),
                _count: 12,
                alternativeValue: 23
              }
            ])
          }
        ]);
        collection.getCurrentSelection = jasmine.createSpy().andReturn({});
        graph = new StackedGraph({
          collection: collection
        });
        graph.innerWidth = 444;
        graph.innerHeight = 333;

      });

      it('calculates d3 stack', function () {
        graph.render();

        expect(graph.layers.length).toEqual(3);
        expect(graph.layers[0].get('values').at(0).y0).toEqual(0);
        expect(graph.layers[0].get('values').at(0).y).toEqual(2);
        expect(graph.layers[0].get('values').at(1).y0).toEqual(0);
        expect(graph.layers[0].get('values').at(1).y).toEqual(7);
        expect(graph.layers[0].get('values').at(2).y0).toEqual(0);
        expect(graph.layers[0].get('values').at(2).y).toEqual(12);

        expect(graph.layers[1].get('values').at(0).y0).toEqual(2);
        expect(graph.layers[1].get('values').at(0).y).toEqual(1);

        expect(graph.layers[2].get('values').at(0).y0).toEqual(3);
        expect(graph.layers[2].get('values').at(0).y).toEqual(90);
      });

      it('calculates d3 stack using custom properties', function () {
        graph.stackYProperty = 'yCustom';
        graph.stackY0Property = 'yCustom0';
        graph.outStack = function (model, y0, y) {
          model.yCustom0 = y0;
          model.yCustom = y;
        };
        graph.render();

        expect(graph.layers.length).toEqual(3);
        expect(graph.layers[0].get('values').at(0).yCustom0).toEqual(0);
        expect(graph.layers[0].get('values').at(0).yCustom).toEqual(2);
        expect(graph.layers[0].get('values').at(1).yCustom0).toEqual(0);
        expect(graph.layers[0].get('values').at(1).yCustom).toEqual(7);
        expect(graph.layers[0].get('values').at(2).yCustom0).toEqual(0);
        expect(graph.layers[0].get('values').at(2).yCustom).toEqual(12);

        expect(graph.layers[1].get('values').at(0).yCustom0).toEqual(2);
        expect(graph.layers[1].get('values').at(0).yCustom).toEqual(1);

        expect(graph.layers[2].get('values').at(0).yCustom0).toEqual(3);
        expect(graph.layers[2].get('values').at(0).yCustom).toEqual(90);
      });
    });

    describe('calcYScale', function () {

      var collection, graph;
      beforeEach(function () {
        collection = new Collection();

        collection.reset([
          {
            id: 'total',
            title: 'Total applications',
            values: new Collection([
              {
                _start_at: collection.getMoment('2013-01-14').startOf('day'),
                _end_at: collection.getMoment('2013-01-21').startOf('day'),
                _count: 90,
                alternativeValue: 444
              },
              {
                _start_at: collection.getMoment('2013-01-21').startOf('day'),
                _end_at: collection.getMoment('2013-01-28').startOf('day'),
                _count: 100,
                alternativeValue: 333
              },
              {
                _start_at: collection.getMoment('2013-01-28').startOf('day'),
                _end_at: collection.getMoment('2013-02-04').startOf('day'),
                _count: 114,
                alternativeValue: 222
              }
            ])
          },
          {
            id: 'westminster',
            title: 'Westminster',
            values: new Collection([
              {
                _start_at: collection.getMoment('2013-01-14').startOf('day'),
                _end_at: collection.getMoment('2013-01-21').startOf('day'),
                _count: 1,
                alternativeValue: 100
              },
              {
                _start_at: collection.getMoment('2013-01-21').startOf('day'),
                _end_at: collection.getMoment('2013-01-28').startOf('day'),
                _count: 6,
                alternativeValue: 99
              },
              {
                _start_at: collection.getMoment('2013-01-28').startOf('day'),
                _end_at: collection.getMoment('2013-02-04').startOf('day'),
                _count: 11,
                alternativeValue: 98
              }
            ])
          },
          {
            id: 'croydon',
            title: 'Croydon',
            values: new Collection([
              {
                _start_at: collection.getMoment('2013-01-14').startOf('day'),
                _end_at: collection.getMoment('2013-01-21').startOf('day'),
                _count: 2,
                alternativeValue: 80
              },
              {
                _start_at: collection.getMoment('2013-01-21').startOf('day'),
                _end_at: collection.getMoment('2013-01-28').startOf('day'),
                _count: 7,
                alternativeValue: 87
              },
              {
                _start_at: collection.getMoment('2013-01-28').startOf('day'),
                _end_at: collection.getMoment('2013-02-04').startOf('day'),
                _count: 12,
                alternativeValue: 23
              }
            ])
          }
        ]);
        collection.getCurrentSelection = jasmine.createSpy().andReturn({});
        graph = new StackedGraph({
          collection: collection
        });
        graph.innerWidth = 444;
        graph.innerHeight = 333;

      });

      it('scales domain from 0 to nice value above max value', function () {
        expect(graph.calcYScale().domain()).toEqual([0, 140]);
      });

      it('scales domain from 0 to nice value above max value when an alternative value attribute is used', function () {
        graph.valueAttr = 'alternativeValue';
        expect(graph.calcYScale().domain()).toEqual([0, 700]);
      });

      it('scales range to inner height', function () {
        expect(graph.calcYScale().range()).toEqual([333, 0]);
      });

      it('sets the tick values correctly', function () {
        expect(graph.calcYScale().tickValueList)
            .toEqual([0, 20, 40, 60, 80, 100, 120, 140]);
      });

      it('scales domain from 0 to nice value above maximum sum of point in time when an alternative value attribute is used', function () {
        graph.valueAttr = 'alternativeValue';
        expect(graph.calcYScale().domain()).toEqual([0, 700]);
      });

    });


  });
});
