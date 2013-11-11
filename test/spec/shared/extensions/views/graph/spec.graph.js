define([
  'extensions/views/graph/graph',
  'extensions/collections/collection',
  'd3'
],
function (Graph, Collection, d3) {
  describe("Graph", function() {
    
    it("keeps a reference to d3 library", function() {
      spyOn(Graph.prototype, "prepareGraphArea");
      var view = new Graph({
        collection: {
          on: jasmine.createSpy()
        }
      });
      expect(view.d3).toBe(d3);
    });
    
    describe("initialize", function() {
      
      var collection, TestGraph, testComponent1, testComponent2;
      beforeEach(function() {
        collection = new Collection();
        testComponent1 = jasmine.createSpy();
        testComponent2 = jasmine.createSpy();
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
            }
          }
        });
        spyOn(TestGraph.prototype, "render");
        spyOn(TestGraph.prototype, "prepareGraphArea");
      });
      
      it("re-renders when collection resets", function() {
        var graph = new TestGraph({
          collection: collection
        });
        collection.trigger('reset');
        expect(graph.render).toHaveBeenCalled();
      });
      
      it("re-renders when item is added to collection", function() {
        var graph = new TestGraph({
          collection: collection
        });
        collection.trigger('add');
        expect(graph.render).toHaveBeenCalled();
      });
      
      it("re-renders when items is removed from collection", function() {
        var graph = new TestGraph({
          collection: collection
        });
        collection.trigger('remove');
        expect(graph.render).toHaveBeenCalled();
      });
      
      it("prepare graph area", function() {
        var graph = new TestGraph({
          collection: collection
        });
        expect(graph.prepareGraphArea).toHaveBeenCalled();
      });
      
      it("initialises components", function() {
        var graph = new TestGraph({
          collection: collection
        });
        expect(testComponent1).toHaveBeenCalledWith({
          a: 'b',    // default option
          foo: 'bar' // component option
        });
        expect(testComponent2).toHaveBeenCalledWith({
          a: 'c',    // overridden default option
          foo: 'baz' // component option
        });
        expect(graph.componentInstances[0] instanceof testComponent1).toBe(true);
        expect(graph.componentInstances[1] instanceof testComponent2).toBe(true);
      });
    });
    
    describe("prepareGraphArea", function() {
      
      var graph, el;
      beforeEach(function() {
        el = $('<div id="jasmine-playground"></div>').appendTo($('body'));
        
        var TestGraph = Graph.extend();
        graph = new TestGraph({
          el: el,
          collection: new Collection()
        });
      });
      
      afterEach(function() {
        el.remove();
      });

      it("creates element to measure size of inner graph area", function () {
        expect(graph.el.find('.inner').length).toEqual(1);
      });

      it("creates empty SVG element", function () {
        var svg = graph.el.find('svg');
        expect(svg.length).toEqual(1);
      });
      
      it("creates wrapper element", function() {
        var wrapper = graph.el.find('svg g.wrapper');
        expect(wrapper.length).toEqual(1);
      });
    });

    describe("pxToValue", function () {
      var pxToValue = Graph.prototype.pxToValue;

      it("extracts number from valid CSS px values", function () {
        expect(pxToValue('1px')).toEqual(1);
        expect(pxToValue('1.0px')).toEqual(1);
        expect(pxToValue('0.5px')).toEqual(0.5);
        expect(pxToValue('100px')).toEqual(100);
      });

      it("returns null when it is not a valid CSS px value", function () {
        expect(pxToValue(100)).toEqual(null);
        expect(pxToValue(1)).toEqual(null);
        expect(pxToValue('1p')).toEqual(null);
        expect(pxToValue(null)).toEqual(null);
        expect(pxToValue(undefined)).toEqual(null);
        expect(pxToValue(true)).toEqual(null);
        expect(pxToValue(false)).toEqual(null);
      });
    });
    
    describe("resize", function () {

      var graph, el, wrapper, style;
      beforeEach(function() {
        wrapper = $('<div id="jasmine-playground"></div>').appendTo($('body'));
        el = $('<div></div>').appendTo(wrapper);
        graph = new Graph({
          collection: new Collection(),
          el: el
        });
        spyOn(graph, "render");
      });

      function withGraphStyle(graphStyle) {
        style = $('<style type="text/css">.graph {' + graphStyle + '}</style>').appendTo($('body'));
        graph.svg.attr({"class":  "graph"});
      }
      
      afterEach(function() {
        wrapper.remove();
        style.remove();
      });

      it("re-scales graph according to aspect ratio when both max-width and max-height are defined", function () {
        wrapper.css({
          width: '150px'
        });
        withGraphStyle("max-width: 200px; max-height:100px;");

        graph.resize();
        expect(graph.width).toEqual(150);
        expect(graph.height).toEqual(75);
      });

      it("re-scales graph according to min-height when defined", function () {
        wrapper.css({
          width: '150px'
        });
        withGraphStyle("max-width: 200px; max-height:100px; min-height:80px");

        graph.resize();
        expect(graph.width).toEqual(150);
        expect(graph.height).toEqual(80);
      });

      it("re-scales graph according to defined height and available width", function () {
        wrapper.css({
          width: '150px',
          height: '100px'
        });
        withGraphStyle("max-width: 200px;");

        graph.resize();
        expect(graph.width).toEqual(150);
        expect(graph.height).toEqual(100);
      });

      it("updates SVG element with auto resize options", function() {
        wrapper.css({
          width: '150px'
        });
        withGraphStyle("max-width: 200px; max-height:100px;");
        graph.resize();

        var svg = graph.el.find('svg');
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
      
      it("calculates inner dimensions and margin", function() {
        wrapper.css({
          width: '150px',
          position: 'relative'
        });
        withGraphStyle("max-width: 200px; max-height:100px;");

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
    
    describe("render", function() {

      var graph;
      beforeEach(function() {
        spyOn(Graph.prototype, 'prepareGraphArea');
        graph = new Graph({
          collection: new Collection()
        });
        spyOn(graph, "resizeWithCalloutHidden");
      });

      it("resizes the graph", function () {
        graph.calcXScale = jasmine.createSpy().andReturn('test x scale');
        graph.calcYScale = jasmine.createSpy().andReturn('test y scale');
        graph.render();
        expect(graph.resizeWithCalloutHidden).toHaveBeenCalled();
      });

      it("applies configurations to graph", function () {
        spyOn(graph, "applyConfig");
        spyOn(graph, "getConfigNames").andReturn(['foo', 'bar']);
        graph.calcXScale = jasmine.createSpy().andReturn('test x scale');
        graph.calcYScale = jasmine.createSpy().andReturn('test y scale');
        graph.render();
        expect(graph.applyConfig).toHaveBeenCalledWith('foo');
        expect(graph.applyConfig).toHaveBeenCalledWith('bar');
      });

      it("requires a configuration for the y dimension", function() {
        expect(function () {
          graph.render();
        }).toThrow();
      });
      
      it("requires x and y scale implementation s", function() {
        graph.getConfigNames = function () {
          return [];
        };
        expect(function () { graph.render(); }).toThrow();

        graph.calcXScale = jasmine.createSpy().andReturn('test x scale');
        expect(function () { graph.render(); }).toThrow();

        graph.calcYScale = jasmine.createSpy().andReturn('test y scale');
        expect(function () { graph.render(); }).not.toThrow();

        expect(graph.scales.x).toEqual('test x scale');
        expect(graph.scales.y).toEqual('test y scale');
      });
      
      it("renders component instances", function() {
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
    });
    
    describe("scaleFactor", function () {
      var el, TestGraph;
      beforeEach(function() {
          el = $('<div id="jasmine-playground"></div>').appendTo($('body'));
          el.css('display', 'block');
          TestGraph = Graph.extend({
            width: 600,
            height: 400
          });
      });
      
      afterEach(function() {
          el.remove();
      });
      
      it("calculates the scale factor when the graph is not resized", function() {
          el.width(600);
          graph = new TestGraph({
            el: el,
            collection: new Collection()
          });
          expect(graph.scaleFactor()).toEqual(1);
      });
      
      it("calculates the scale factor when the graph is resized", function() {
          el.width(300);
          graph = new TestGraph({
            el: el,
            collection: new Collection()
          });
          expect(graph.scaleFactor()).toEqual(0.5);
      });
    });
    
    describe("configs", function () {

      var collection, graph, el;
      beforeEach(function() {
        el = $('<div id="jasmine-playground"></div>').appendTo($('body'));
        
        collection = new Collection([
          {
            id: 'total',
            title: 'Total applications',
            values: new Collection([
              {
                _start_at: moment('2013-01-14').startOf('day'),
                _end_at: moment('2013-01-21').startOf('day'),
                _count: 90,
                alternativeValue: 444
              },
              {
                _start_at: moment('2013-01-21').startOf('day'),
                _end_at: moment('2013-01-28').startOf('day'),
                _count: 100,
                alternativeValue: 333
              },
              {
                _start_at: moment('2013-01-28').startOf('day'),
                _end_at: moment('2013-02-04').startOf('day'),
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
                _start_at: moment('2013-01-14').startOf('day'),
                _end_at: moment('2013-01-21').startOf('day'),
                _count: 1,
                alternativeValue: 100
              },
              {
                _start_at: moment('2013-01-21').startOf('day'),
                _end_at: moment('2013-01-28').startOf('day'),
                _count: 6,
                alternativeValue: 99
              },
              {
                _start_at: moment('2013-01-28').startOf('day'),
                _end_at: moment('2013-02-04').startOf('day'),
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
                _start_at: moment('2013-01-14').startOf('day'),
                _end_at: moment('2013-01-21').startOf('day'),
                _count: 2,
                alternativeValue: 80
              },
              {
                _start_at: moment('2013-01-21').startOf('day'),
                _end_at: moment('2013-01-28').startOf('day'),
                _count: 7,
                alternativeValue: 87
              },
              {
                _start_at: moment('2013-01-28').startOf('day'),
                _end_at: moment('2013-02-04').startOf('day'),
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
      
      afterEach(function() {
        el.remove();
      });


      function sharedSpecsForScalingBetweenStartAndEndDates() {
        describe("calcXScale", function() {
          it("scales domain from start entry end date to end entry end date", function() {
            graph.applyConfig('day');
            var domain = graph.calcXScale().domain();
            expect(moment(domain[0]).format('YYYY-MM-DD')).toEqual('2013-01-20');
            expect(moment(domain[1]).format('YYYY-MM-DD')).toEqual('2013-02-03');
          });

          it("scales range to inner width", function() {
            graph.applyConfig('day');
            expect(graph.calcXScale().range()).toEqual([0, 444]);
          });
        });
      }

      describe("day", function () {
        sharedSpecsForScalingBetweenStartAndEndDates();
      });

      describe("week", function () {
        sharedSpecsForScalingBetweenStartAndEndDates();
      });

      describe("hour", function () {

        beforeEach(function() {
          var start = moment.utc('2013-03-13T00:00:00');
          var end = moment.utc('2013-03-14T00:00:00');
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

        describe("calcXScale", function() {
          it("scales domain from first timestamp to last timestamp", function() {
            var domain = graph.calcXScale().domain();
            expect(moment(domain[0]).format()).toEqual('2013-03-13T00:00:00+00:00');
            expect(moment(domain[1]).format()).toEqual('2013-03-13T23:00:00+00:00');
          });
          
          it("scales range to inner width", function() {
            expect(graph.calcXScale().range()).toEqual([0, 444]);
          });
        });
      });

      describe("overlay", function () {

        beforeEach(function() {
          graph.applyConfig('overlay');
        });

        describe("calcYScale", function() {
          it("scales domain to a minimum value of 6 to avoid extreme line jumps on graph and duplicate y axis values", function () {
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
          
          it("scales domain from 0 to nice value above max value by default", function() {
            expect(graph.calcYScale().domain()).toEqual([0, 120]);
          });

          it("scales domain from 0 to nice value above max value by default when an alternative value attribute is used", function () {
            graph.valueAttr = 'alternativeValue';
            expect(graph.calcYScale().domain()).toEqual([0, 500]);
          });
          
          it("scales domain from 0 to nice value above maximum sum of point in time when an alternative value attribute is used", function () {
            graph.valueAttr = 'alternativeValue';
            graph.applyConfig('stack');
            expect(graph.calcYScale().domain()).toEqual([0, 700]);
          });
          
          it("scales range to inner height", function() {
            expect(graph.calcYScale().range()).toEqual([333, 0]);
          });

          it("sets the tickValues correctly", function() {
            expect(graph.calcYScale().tickValues)
                .toEqual([0, 20, 40, 60, 80, 100, 120])
          })
        });
      });

      describe("stack", function () {

        describe("calculation", function () {
          it("calculates d3 stack", function () {
            graph.applyConfig('stack');

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

          it("calculates d3 stack using custom properties", function () {
            graph.stackYProperty = 'yCustom';
            graph.stackY0Property = 'yCustom0';
            graph.outStack = function (model, y0, y) {
              model.yCustom0 = y0;
              model.yCustom = y;
            };

            graph.applyConfig('stack');
            
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

        describe("calcYScale", function() {

          beforeEach(function() {
            graph.applyConfig('stack');
          });

          it("scales domain from 0 to nice value above max value", function() {
            expect(graph.calcYScale().domain()).toEqual([0, 140]);
          });
          
          it("scales domain from 0 to nice value above max value when an alternative value attribute is used", function () {
            graph.valueAttr = 'alternativeValue';
            expect(graph.calcYScale().domain()).toEqual([0, 700]);
          });
          
          it("scales range to inner height", function() {
            expect(graph.calcYScale().range()).toEqual([333, 0]);
          });

          it("sets the tickValues correctly", function() {
              expect(graph.calcYScale().tickValues)
                  .toEqual([0, 20, 40, 60, 80, 100, 120, 140])
          });
        });
      });
    });
  });
});
