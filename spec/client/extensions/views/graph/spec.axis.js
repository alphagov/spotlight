define([
  'extensions/views/graph/axis'
],
function (Axis) {
  
  describe("render", function() {
    
    var el, wrapper;
    beforeEach(function() {
      el = $('<div></div>').appendTo($('body'));
      wrapper = Axis.prototype.d3.select(el[0]).append('svg').append('g');
    });
    
    afterEach(function() {
      el.remove();
    });
    
    it("requires a scale", function() {
      expect(function () {
        var view = new Axis({
          wrapper: wrapper
        });
        view.render()
      }).toThrow();
    });
    
    it("renders a d3 axis component", function() {
      
      var view = new Axis({
        collection: {
          on: jasmine.createSpy()
        },
        wrapper: wrapper,
        classed: 'testclass',
        getScale: function () {
          return view.d3.scale.linear()
        },
        graph: {
          innerWidth: 100,
          innerHeight: 100
        }
      });
      spyOn(view.d3.svg, "axis").andCallThrough();
      
      view.render()
      
      expect(wrapper.selectAll('.tick')[0].length).toEqual(11);
    });

    it("re-orders tick elements correctly when re-using tick elements", function () {
      var view = new Axis({
        collection: {
          on: jasmine.createSpy()
        },
        wrapper: wrapper,
        classed: 'testclass',
        getScale: function () {
          return view.d3.scale.linear()
        },
        graph: {
          innerWidth: 100,
          innerHeight: 100
        },
        tickValues: [2,4,6]
      });
      spyOn(view.d3.svg, "axis").andCallThrough();
      
      view.render()
      
      var ticks = wrapper.selectAll('.tick')[0];
      expect(wrapper.selectAll('.tick')[0].length).toEqual(3);
      expect(d3.select(ticks[0]).text()).toEqual('2.0');
      expect(d3.select(ticks[1]).text()).toEqual('4.0');
      expect(d3.select(ticks[2]).text()).toEqual('6.0');

      view.tickValues = [1,2,3];
      view.render();

      var ticks = wrapper.selectAll('.tick')[0];
      expect(d3.select(ticks[0]).text()).toEqual('1.0');
      expect(d3.select(ticks[1]).text()).toEqual('2.0');
      expect(d3.select(ticks[2]).text()).toEqual('3.0');
    });
    
  });
  
  describe("getTransform", function() {
    
    var view;
    beforeEach(function() {
      view = new Axis({
        collection: {
          on: jasmine.createSpy()
        },
        graph: {
          innerWidth: 555,
          innerHeight: 444
        }
      });
    });
    
    it("calculates default translation for position left", function() {
      view.position = 'left';
      expect(view.getTransform()).toEqual('translate(0,0)');
    });
    
    it("calculates default translation for position right", function() {
      view.position = 'right';
      expect(view.getTransform()).toEqual('translate(555,0)');
    });
    
    it("calculates default translation for position top", function() {
      view.position = 'top';
      expect(view.getTransform()).toEqual('translate(0,0)');
    });
    
    it("calculates default translation for position bottom", function() {
      view.position = 'bottom';
      expect(view.getTransform()).toEqual('translate(0,444)');
    });
    
    it("calculates custom translation for position left", function() {
      view.position = 'left';
      view.offsetX = 7;
      view.offsetY = 8;
      expect(view.getTransform()).toEqual('translate(7,8)');
    });
    
    it("calculates custom translation for position right", function() {
      view.position = 'right';
      view.offsetX = 7;
      view.offsetY = 8;
      expect(view.getTransform()).toEqual('translate(562,8)');
    });
    
    it("calculates custom translation for position top", function() {
      view.position = 'top';
      view.offsetX = 7;
      view.offsetY = 8;
      expect(view.getTransform()).toEqual('translate(7,8)');
    });
    
    it("calculates custom translation for position bottom", function() {
      view.position = 'bottom';
      view.offsetX = 7;
      view.offsetY = 8;
      expect(view.getTransform()).toEqual('translate(7,452)');
    });
    
  });
  
});
