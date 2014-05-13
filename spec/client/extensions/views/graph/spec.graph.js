define([
  'extensions/views/graph/graph',
  'extensions/views/graph/table',
  'extensions/collections/collection',
  'extensions/models/model',
  'extensions/views/view',
  'd3'
],
function (Graph, GraphTable, Collection, Model, View, d3) {

  describe('Graph', function () {

    beforeEach(function () {
      spyOn(GraphTable.prototype, 'initialize');
      spyOn(Graph.prototype, 'isVisible').andReturn(true);
    });

    it('keeps a reference to d3 library', function () {
      spyOn(Graph.prototype, 'prepareGraphArea');
      var view = new Graph({
        collection: {
          on: jasmine.createSpy(),
          options: {
            axes: true
          }
        }
      });
      expect(view.d3).toBe(d3);
    });


    var style;
    function withGraphStyle(graphStyle) {
      style = $('<style type="text/css">figure.graph { margin: 0 } figure.graph svg {' + graphStyle + '}</style>').appendTo($('body'));
    }
    afterEach(function () {
      if (style) {
        style.remove();
        style = null;
      }
    });


    describe('initialize', function () {

      var collection, TestGraph, testComponent1, testComponent2;
      beforeEach(function () {
        collection = new Collection();
        testComponent1 = View.extend({
          initialize: jasmine.createSpy(),
          remove: jasmine.createSpy()
        });
        testComponent2 = View.extend({
          initialize: jasmine.createSpy(),
          remove: jasmine.createSpy()
        });
        TestGraph = Graph.extend({
          components: [
            {
              view: testComponent1,
              options: {
                foo: 'bar'
              }
            },
            {
              view: testComponent2,
              options: {
                foo: 'baz',
                a: 'c'
              }
            }
          ],
          getDefaultComponentOptions: function () {
            return {
              a: 'b'
            };
          }
        });
        spyOn(TestGraph.prototype, 'render');
        spyOn(TestGraph.prototype, 'prepareGraphArea');
      });

      it('only creates a table if options.axis is present', function () {
        spyOn(Graph.prototype, 'prepareGraphArea');
        var graph = new TestGraph({
          collection: {
            on: jasmine.createSpy(),
            options: {
              axes: true
            }
          }
        });
        expect(graph.table).toBeDefined();

        graph = new TestGraph({
          collection: {
            on: jasmine.createSpy(),
            options: {
            }
          }
        });
        expect(graph.table).toBeUndefined();
      });

      it('re-renders when collection resets', function () {
        var graph = new TestGraph({
          collection: collection
        });
        collection.trigger('reset');
        expect(graph.render).toHaveBeenCalled();
      });

      it('re-renders when collection syncs', function () {
        var graph = new TestGraph({
          collection: collection
        });
        collection.trigger('sync');
        expect(graph.render).toHaveBeenCalled();
      });

      it('re-renders when item is added to collection', function () {
        var graph = new TestGraph({
          collection: collection
        });
        collection.trigger('add');
        expect(graph.render).toHaveBeenCalled();
      });

      it('re-renders when items is removed from collection', function () {
        var graph = new TestGraph({
          collection: collection
        });
        collection.trigger('remove');
        expect(graph.render).toHaveBeenCalled();
      });

      it('does not render if it has been removed', function () {
        var graph = new TestGraph({
          collection: collection
        });
        graph.remove();
        collection.trigger('reset');
        expect(graph.render).not.toHaveBeenCalled();
      });

      it('prepares the graph area', function () {
        var graph = new TestGraph({
          collection: collection
        });
        expect(graph.prepareGraphArea).toHaveBeenCalled();
      });

      it('initialises components', function () {
        var graph = new TestGraph({
          collection: collection
        });
        expect(testComponent1.prototype.initialize).toHaveBeenCalledWith({
          a: 'b',    // default option
          foo: 'bar' // component option
        });
        expect(testComponent2.prototype.initialize).toHaveBeenCalledWith({
          a: 'c',    // overridden default option
          foo: 'baz' // component option
        });
        expect(graph.componentInstances[0] instanceof testComponent1).toBe(true);
        expect(graph.componentInstances[1] instanceof testComponent2).toBe(true);
      });
    });

    describe('prepareGraphArea', function () {

      var graph, el, TestGraph;
      beforeEach(function () {
        el = $('<div id="jasmine-playground"></div>').appendTo($('body'));

        TestGraph = Graph.extend();
        graph = new TestGraph({
          el: el,
          collection: new Collection()
        });
      });

      afterEach(function () {
        el.remove();
      });

      it('creates element to measure size of inner graph area', function () {
        expect(graph.$el.find('.inner').length).toEqual(1);
      });

      it('creates empty SVG element', function () {
        var svg = graph.$el.find('svg');
        expect(svg.length).toEqual(1);
      });

      it('renders an SVG element with correct WAI-ARIA attributes', function () {
        var svg = graph.$el.find('svg');
        expect(svg.attr('role')).toEqual('presentation');
        expect(svg.attr('aria-hidden')).toEqual('true');
      });

      it('creates wrapper element', function () {
        var wrapper = graph.$el.find('svg g.wrapper');
        expect(wrapper.length).toEqual(1);
      });

      describe('when the models "show-line-labels" attribute is not falsy', function () {
        it('creates a figure with the class graph', function () {
          expect(graph.$el.find('figure.graph').length).toEqual(1);
          expect(graph.$el.find('figure.graph.graph-with-labels').length).toEqual(0);
        });
      });
      describe('when the models "show-line-labels" attribute is not falsy', function () {
        it('creates a figure with the class graph graph-with-labels', function () {
          var model = new Model({
            'show-line-labels': true
          });
          graph = new TestGraph({
            el: el,
            collection: new Collection(),
            model: model
          });
          expect(graph.$el.find('figure.graph.graph-with-labels').length).toEqual(1);
        });
      });
    });

    describe('pxToValue', function () {
      var pxToValue = Graph.prototype.pxToValue;

      it('extracts number from valid CSS px values', function () {
        expect(pxToValue('1px')).toEqual(1);
        expect(pxToValue('1.0px')).toEqual(1);
        expect(pxToValue('0.5px')).toEqual(0.5);
        expect(pxToValue('100px')).toEqual(100);
      });

      it('returns null when it is not a valid CSS px value', function () {
        expect(pxToValue(100)).toEqual(null);
        expect(pxToValue(1)).toEqual(null);
        expect(pxToValue('1p')).toEqual(null);
        expect(pxToValue(null)).toEqual(null);
        expect(pxToValue(undefined)).toEqual(null);
        expect(pxToValue(true)).toEqual(null);
        expect(pxToValue(false)).toEqual(null);
      });
    });

    describe('resize', function () {

      var graph, el, wrapper;
      beforeEach(function () {
        wrapper = $('<div id="jasmine-playground"></div>').appendTo($('body'));
        el = $('<div></div>').appendTo(wrapper);
        graph = new Graph({
          collection: new Collection(),
          el: el
        });
        spyOn(graph, 'render');
      });

      afterEach(function () {
        wrapper.remove();
      });

      it('re-scales graph according to aspect ratio when both max-width and max-height are defined', function () {
        wrapper.css({
          width: '150px'
        });
        withGraphStyle('max-width: 200px; max-height:100px;');

        graph.resize();
        expect(graph.width).toEqual(150);
        expect(graph.height).toEqual(75);
      });

      it('re-scales graph according to min-height when defined', function () {
        wrapper.css({
          width: '150px'
        });
        withGraphStyle('max-width: 200px; max-height:100px; min-height:80px');

        graph.resize();
        expect(graph.width).toEqual(150);
        expect(graph.height).toEqual(80);
      });

      it('re-scales graph according to defined height and available width', function () {
        wrapper.css({
          width: '150px',
          height: '100px'
        });
        withGraphStyle('max-width: 200px;');

        graph.resize();
        expect(graph.width).toEqual(150);
        expect(graph.height).toEqual(100);
      });

      it('updates SVG element with auto resize options', function () {
        wrapper.css({
          width: '150px'
        });
        withGraphStyle('max-width: 200px; max-height:100px;');
        graph.resize();

        var svg = graph.$el.find('svg');
        expect(svg.length).toEqual(1);
        expect(svg.attr('width')).toEqual('100%');
        expect(svg.attr('height')).toEqual('100%');
        expect(svg.prop('viewBox').baseVal.x).toEqual(0);
        expect(svg.prop('viewBox').baseVal.y).toEqual(0);
        expect(svg.prop('viewBox').baseVal.width).toEqual(150);
        expect(svg.prop('viewBox').baseVal.height).toEqual(75);
        expect(svg.css('max-width')).toEqual('150px');
        expect(svg.css('max-height')).toEqual('75px');
        expect(svg.css('display')).toEqual('block');
      });

      it('calculates inner dimensions and margin', function () {
        wrapper.css({
          width: '150px',
          position: 'relative'
        });
        withGraphStyle('max-width: 200px; max-height:100px;');

        el.find('.inner').css({
          position: 'absolute',
          top: '1px',
          right: '2px',
          bottom: '3px',
          left: '4px'
        });
        graph.resize();

        expect(graph.innerWidth).toEqual(150 - 2 - 4);
        expect(graph.innerHeight).toEqual(75 - 1 - 3);
        expect(graph.margin.top).toEqual(1);
        expect(graph.margin.right).toEqual(2);
        expect(graph.margin.bottom).toEqual(3);
        expect(graph.margin.left).toEqual(4);
      });

    });

    describe('render', function () {

      var graph;
      beforeEach(function () {
        spyOn(Graph.prototype, 'prepareGraphArea').andCallThrough();
        graph = new Graph({
          collection: new Collection()
        });
        spyOn(graph.collection, 'isEmpty').andReturn(false);
        spyOn(graph, 'resizeWithCalloutHidden');
      });

      it('sets the currency on render, if defined', function () {
        spyOn(graph, 'applyConfig');
        graph.calcXScale = jasmine.createSpy().andReturn('test x scale');
        graph.calcYScale = jasmine.createSpy().andReturn('test y scale');
        graph.collection.options = {
          currency: 'gbp'
        };
        graph.render();
        expect(graph.currency).toEqual('gbp');
      });

      it('resizes the graph', function () {
        spyOn(graph, 'applyConfig');
        graph.calcXScale = jasmine.createSpy().andReturn('test x scale');
        graph.calcYScale = jasmine.createSpy().andReturn('test y scale');
        graph.render();
        expect(graph.resizeWithCalloutHidden).toHaveBeenCalled();
      });

      it('applies configurations to graph', function () {
        spyOn(graph, 'applyConfig');
        spyOn(graph, 'getConfigNames').andReturn(['foo', 'bar']);
        graph.calcXScale = jasmine.createSpy().andReturn('test x scale');
        graph.calcYScale = jasmine.createSpy().andReturn('test y scale');
        graph.render();
        expect(graph.applyConfig).toHaveBeenCalledWith('foo');
        expect(graph.applyConfig).toHaveBeenCalledWith('bar');
      });

      it('requires a configuration for the y dimension', function () {
        expect(function () {
          graph.render();
        }).toThrow();
      });

      it('requires x and y scale implementation s', function () {
        graph.getConfigNames = function () {
          return [];
        };
        expect(function () { graph.render(); }).toThrow();

        graph.calcXScale = jasmine.createSpy().andReturn('test x scale');
        expect(function () { graph.render(); }).not.toThrow();

        expect(graph.scales.x).toEqual('test x scale');
      });

      it('renders component instances', function () {
        graph.getConfigNames = function () {
          return [];
        };
        graph.calcXScale = jasmine.createSpy().andReturn('test x scale');
        graph.calcYScale = jasmine.createSpy().andReturn('test y scale');
        var component1 = {
          render: jasmine.createSpy()
        };
        var component2 = {
          render: jasmine.createSpy()
        };
        graph.componentInstances = [component1, component2];
        graph.render();
        expect(component1.render).toHaveBeenCalled();
        expect(component2.render).toHaveBeenCalled();
      });

      it('renders a "no data" message if no data is provided', function () {
        graph.collection.isEmpty.andReturn(true);
        graph.render();
        expect(graph.figure.text()).toContain('(no data)');
      });

    });

    describe('remove', function () {

      var TestGraph, TestComponent1, TestComponent2;
      beforeEach(function () {
        TestComponent1 = View.extend({
          initialize: jasmine.createSpy(),
          remove: jasmine.createSpy()
        });
        TestComponent2 = View.extend({
          initialize: jasmine.createSpy(),
          remove: jasmine.createSpy()
        });
        TestGraph = Graph.extend({
          components: [
            {
              view: TestComponent1,
              options: {
                foo: 'bar'
              }
            },
            {
              view: TestComponent2,
              options: {
                foo: 'baz',
                a: 'c'
              }
            }
          ],
          getDefaultComponentOptions: function () {
            return {
              a: 'b'
            };
          }
        });
      });

      it('removes component instances', function () {
        var graph = new TestGraph({
          collection: new Collection()
        });
        graph.remove();
        expect(TestComponent1.prototype.remove).toHaveBeenCalled();
        expect(TestComponent2.prototype.remove).toHaveBeenCalled();
      });

      it('removes table if it exists', function () {
        spyOn(GraphTable.prototype, 'remove');
        var graph = new TestGraph({
          collection: {
            on: function () {},
            off: function () {},
            options: {
              axes: true
            }
          }
        });
        graph.remove();
        expect(graph.table.remove).toHaveBeenCalled();
      });

    });

    describe('scaleFactor', function () {
      var el, TestGraph, graph;
      beforeEach(function () {
        el = $('<div id="jasmine-playground"></div>').appendTo($('body'));
        el.css('display', 'block');
        TestGraph = Graph.extend({
          width: 600,
          height: 400
        });
        withGraphStyle();
      });

      afterEach(function () {
        el.remove();
      });

      it('calculates the scale factor when the graph is not resized', function () {
        el.width(600);
        graph = new TestGraph({
          el: el,
          collection: new Collection()
        });
        expect(graph.scaleFactor()).toEqual(1);
      });

      it('calculates the scale factor when the graph is resized', function () {
        el.width(300);
        graph = new TestGraph({
          el: el,
          collection: new Collection()
        });
        expect(graph.scaleFactor()).toEqual(0.5);
      });
    });

    describe('calculateLinearTicks', function () {
      describe('extending the extent', function () {
        it('should extend the top limit beyond the max', function () {
          var ticks = Graph.prototype.calculateLinearTicks([0, 7000], 5);
          expect(ticks.values).toEqual([0, 2000, 4000, 6000, 8000]);
          expect(ticks.extent).toEqual([0, 8000]);
          expect(ticks.step).toEqual(2000);
        });

        it('should extend the bottom limit beyond the minimum', function () {
          var ticks = Graph.prototype.calculateLinearTicks([10, 8000], 5);
          expect(ticks.values).toEqual([0, 2000, 4000, 6000, 8000]);
          expect(ticks.extent).toEqual([0, 8000]);
          expect(ticks.step).toEqual(2000);
        });
      });

      describe('number of ticks', function () {
        var extent = [0, 61241];
        it('should increase the number of ticks if it allows nicer ticks', function () {
          var ticks = Graph.prototype.calculateLinearTicks(extent, 2);
          expect(ticks.values).toEqual([0, 50000, 100000]);
        });
        it('should not change the number of ticks if it does not need to', function () {
          var ticks = Graph.prototype.calculateLinearTicks(extent, 3);
          expect(ticks.values).toEqual([0, 50000, 100000]);
        });
        it('should decrease the number of ticks if it allows nicer ticks', function () {
          var extent = [0, 4000];
          var ticks = Graph.prototype.calculateLinearTicks(extent, 7);
          expect(ticks.values).toEqual([0, 1000, 2000, 3000, 4000]);
        });
      });

      // Because this function is designed to work with various and overlapping
      describe('various ranges', function () {
        it('should return valid ticks for 0-5 with 20 ticks', function () {
          var ticks = Graph.prototype.calculateLinearTicks([0, 5], 20);
          var expectations = [0, 0.2, 0.4, 0.6, 0.8, 1, 1.2, 1.4, 1.6, 1.8, 2, 2.2, 2.4, 2.6, 2.8, 3, 3.2, 3.4, 3.6, 3.8, 4, 4.2, 4.4, 4.6, 4.8, 5];
          _.each(ticks.values, function (value, index) {
            expect(value).toBeCloseTo(expectations[index], 4);
          });
          expect(ticks.extent).toEqual([0, 5]);
          expect(ticks.step).toEqual(0.2);
        });

        it('should return valid ticks for 0-1000 with 10 ticks', function () {
          var ticks = Graph.prototype.calculateLinearTicks([0, 1000], 10);
          expect(ticks.values).toEqual([0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]);
          expect(ticks.extent).toEqual([0, 1000]);
          expect(ticks.step).toEqual(100);
        });

        it('should return valid ticks for 0-8000 with 9 ticks', function () {
          var ticks = Graph.prototype.calculateLinearTicks([0, 5000], 7);
          expect(ticks.values).toEqual([0, 1000, 2000, 3000, 4000, 5000]);
          expect(ticks.extent).toEqual([0, 5000]);
          expect(ticks.step).toEqual(1000);
        });

        it('should return valid ticks for 900k-1m with 5 ticks', function () {
          var ticks = Graph.prototype.calculateLinearTicks([9.5e5, 1e6], 5);
          expect(ticks.values).toEqual([950000, 960000, 970000, 980000, 990000, 1000000]);
          expect(ticks.extent).toEqual([950000, 1000000]);
          expect(ticks.step).toEqual(10000);
        });
      });

      describe('invalid argument handling', function () {
        it('should raise an exception if lower bound is > upper bound', function () {
          expect(function () { Graph.prototype.calculateLinearTicks([0, -1], 5); })
              .toThrow(new Error('Upper bound must be larger than lower.'));
        });
        it('should raise an exception if lower bound is == upper bound', function () {
          expect(function () { Graph.prototype.calculateLinearTicks([0, 0], 5); })
              .toThrow(new Error('Upper bound must be larger than lower.'));
        });
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
        graph = new Graph({
          collection: collection
        });
        graph.innerWidth = 444;
        graph.innerHeight = 333;
      });

      it('scales domain to a minimum value of 6 to avoid extreme line jumps on graph and duplicate y axis values', function () {
        collection.at(0).get('values').each(function (model) { model.set('_count', 1); });
        collection.at(1).get('values').each(function (model) { model.set('_count', 1); });
        collection.at(2).get('values').each(function (model) { model.set('_count', 1); });
        expect(graph.calcYScale().domain()).toEqual([0, 6]);

        collection.at(0).get('values').each(function (model) { model.set('_count', 2); });
        collection.at(1).get('values').each(function (model) { model.set('_count', 2); });
        collection.at(2).get('values').each(function (model) { model.set('_count', 2); });
        expect(graph.calcYScale().domain()).toEqual([0, 6]);

        collection.at(0).get('values').each(function (model) { model.set('_count', 5); });
        collection.at(1).get('values').each(function (model) { model.set('_count', 5); });
        collection.at(2).get('values').each(function (model) { model.set('_count', 5); });
        expect(graph.calcYScale().domain()).toEqual([0, 6]);
      });

      it('scales domain from 0 to nice value above max value by default', function () {
        expect(graph.calcYScale().domain()).toEqual([0, 120]);
      });

      it('scales domain from 0 to nice value above max value by default when an alternative value attribute is used', function () {
        graph.valueAttr = 'alternativeValue';
        expect(graph.calcYScale().domain()).toEqual([0, 500]);
      });

      it('scales range to inner height', function () {
        expect(graph.calcYScale().range()).toEqual([333, 0]);
      });

      it('sets the tick values correctly', function () {
        expect(graph.calcYScale().tickValueList)
            .toEqual([0, 20, 40, 60, 80, 100, 120]);
      });

      it('still sets a scale for the domain (rather than throwing an error) when all data in the dataset is null', function () {
        collection.at(0).get('values').each(function (model) { model.set('_count', null); });
        collection.at(1).get('values').each(function (model) { model.set('_count', null); });
        collection.at(2).get('values').each(function (model) { model.set('_count', null); });
        expect(graph.calcYScale().domain()).toEqual([0, 6]);
      });
    });

    describe('configs', function () {

      var collection, graph, el;
      beforeEach(function () {
        el = $('<div id="jasmine-playground"></div>').appendTo($('body'));

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
        graph = new Graph({
          el: el,
          collection: collection
        });
        graph.innerWidth = 444;
        graph.innerHeight = 333;
      });

      afterEach(function () {
        el.remove();
      });


      function sharedSpecsForScalingBetweenStartAndEndDates(period) {
        describe('calcXScale', function () {
          it('scales domain from start entry start date to end entry start date', function () {
            graph.applyConfig(period);
            var domain = graph.calcXScale().domain();
            expect(graph.getMoment(domain[0]).format('YYYY-MM-DD')).toEqual('2013-01-14');
            expect(graph.getMoment(domain[1]).format('YYYY-MM-DD')).toEqual('2013-01-28');
          });

          it('scales range to inner width', function () {
            graph.applyConfig(period);
            expect(graph.calcXScale().range()).toEqual([0, 444]);
          });
        });
        describe('getXPos', function () {
          beforeEach(function () {
            graph.applyConfig(period);
            spyOn(graph, 'modelToDate').andReturn(123);
          });
          describe('groupIndex is set', function () {
            describe('when there is no model at this index', function () {
              beforeEach(function () {
                graph.collection = {
                  at: function (index) {
                    if (index === 4) {
                      return 'model minus one';
                    } else {
                      return null;
                    }
                  }
                };
              });
              describe('when encompassStack is true', function () {
                beforeEach(function () {
                  graph.encompassStack = true;
                });
                it('should return the value of modelToDate with the model at this index minus 1', function () {
                  expect(graph.getXPos(5)).toEqual(123);
                  expect(graph.modelToDate).toHaveBeenCalledWith('model minus one');
                });
              });
            });
            describe('when there is a model at this index', function () {
              beforeEach(function () {
                graph.collection = {
                  at: function () {
                    return 'model';
                  }
                };
              });
              it('should return the value of modelToDate with the model at this index', function () {
                expect(graph.getXPos(5)).toEqual(123);
                expect(graph.modelToDate).toHaveBeenCalledWith('model');
              });
            });
          });
          describe('when groupIndex is not set', function () {
            beforeEach(function () {
              graph.collection = {
                at: function (index) {
                  if (index === 0) {
                    return 'model at 0';
                  }
                }
              };
            });
            it('should return the value of modelToDate with the model at this 0', function () {
              expect(graph.getXPos(null)).toEqual(123);
              expect(graph.modelToDate).toHaveBeenCalledWith('model at 0');
            });
          });
        });
      }

      describe('day', function () {
        sharedSpecsForScalingBetweenStartAndEndDates('day');
      });

      describe('week', function () {
        sharedSpecsForScalingBetweenStartAndEndDates('week');
      });

      describe('month', function () {
        sharedSpecsForScalingBetweenStartAndEndDates('month');
      });

      describe('quarter', function () {
        sharedSpecsForScalingBetweenStartAndEndDates('quarter');
      });

      describe('hour', function () {

        beforeEach(function () {
          var start = graph.getMoment('2013-03-13T00:00:00');
          var end = graph.getMoment('2013-03-14T00:00:00');
          var values = [];
          for (var date = start.clone(); +date < +end; date.add(1, 'hours')) {
            values.push({
              _timestamp: date.clone()
            });
          }

          graph.collection = new Collection([{
            values: new Collection(values)
          }]);
          graph.applyConfig('hour');
        });

        describe('calcXScale', function () {
          it('scales domain from first timestamp to last timestamp', function () {
            var domain = graph.calcXScale().domain();
            expect(graph.getMoment(domain[0]).format()).toEqual('2013-03-13T00:00:00+00:00');
            expect(graph.getMoment(domain[1]).format()).toEqual('2013-03-13T23:00:00+00:00');
          });

          it('scales range to inner width', function () {
            expect(graph.calcXScale().range()).toEqual([0, 444]);
          });
        });
      });
    });
  });
});
