define([
  'extensions/views/graph/hover',
  'extensions/views/graph/graph'
],
function (Hover) {
  describe("Hover Component", function () {
    describe("events", function () {

      var graphWrapper;

      beforeEach(function() {
          graphWrapper = $('<div class ="graph-wrapper"></div>');
          spyOn(Hover.prototype, "onMouseMove");
          spyOn(Hover.prototype, "onTouchStart");
      });
      
      it("listens to mousemove events in mouse environments", function () {
          var component = new Hover({
          modernizr: { touch: false },
          collection: { on: jasmine.createSpy() },
          graph: {
              on: jasmine.createSpy(),
              graphWrapper: graphWrapper
          }
        });
        graphWrapper.appendTo(component.$el);
        component.render();
        
        jasmine.renderView(component, function () {
          component.graph.graphWrapper.find('.hover').trigger('mousemove');
          expect(component.onMouseMove).toHaveBeenCalled();
          expect(component.onTouchStart).not.toHaveBeenCalled();
        });
      });
      
      it("listens to touchstart events in touch environments", function () {
        var component = new Hover({
          modernizr: { touch: true },
          collection: {
            on: jasmine.createSpy(),
            selectItem: jasmine.createSpy()
          },
          graph: { on: jasmine.createSpy(),
                   graphWrapper: graphWrapper}
        });
        graphWrapper.appendTo(component.$el);
        component.render();
        
        jasmine.renderView(component, function () {
          component.$el.find('.hover').trigger('touchstart');
          expect(component.onTouchStart).toHaveBeenCalled();
          expect(component.onMouseMove).not.toHaveBeenCalled();
        });
      });
    });
    
    describe("event handlers", function () {
      var component, scaleFactor;
      beforeEach(function() {
        spyOn(Hover.prototype, "selectPoint");
        component = new Hover({
          bodyListener: true,
          margin: {
            left: 10,
            top: 20,
            right: 30,
            bottom: 40
          },
          collection: { on: jasmine.createSpy() },
          graph: {
            scaleFactor: jasmine.createSpy(),
            on: jasmine.createSpy()
          }
        });
      });
      
      describe("onMouseMove", function () {
        it("calculates the mouse move position when the graph is not scaled", function () {
          spyOn(component.$el, "offset").andReturn({
            left: 200, top: 200
          });
          component.graph.scaleFactor.andReturn(1);
          component.onMouseMove({
            pageX: 300,
            pageY: 300
          });
          expect(component.selectPoint).toHaveBeenCalledWith(90, 80);
        });

        it("calculates the mouse move position when the graph is scaled", function () {
          spyOn(component.$el, "offset").andReturn({
            left: 100, top: 100
          });
          component.graph.scaleFactor.andReturn(0.5);
          component.onMouseMove({
            pageX: 150,
            pageY: 150
          });
          expect(component.selectPoint).toHaveBeenCalledWith(90, 80);
        });
      });
      
      describe("onTouchStart", function () {
        it("calculates the touch position when the graph is not scaled", function () {
          spyOn(component.$el, "offset").andReturn({
            left: 200, top: 200
          });
          component.graph.scaleFactor.andReturn(1);
          component.onTouchStart({
            originalEvent: {
              touches: [{
                pageX: 300,
                pageY: 300
              }]
            }
          });
          expect(component.selectPoint).toHaveBeenCalledWith(90, 80, { toggle: true });
        });

        it("calculates the touch position when the graph is scaled", function () {
          spyOn(component.$el, "offset").andReturn({
            left: 100, top: 100
          });
          component.graph.scaleFactor.andReturn(0.5);
          component.onTouchStart({
            originalEvent: {
              touches: [{
                pageX: 150,
                pageY: 150
              }]
            }
          });
          expect(component.selectPoint).toHaveBeenCalledWith(90, 80, { toggle: true });
        });
      });
      
      describe("getSlice", function () {
        var component;
        beforeEach(function() {
          component = new Hover({
            collection: { on: jasmine.createSpy() },
            graph: {
              innerWidth: 300,
              innerHeight: 200
            }
          })
        });
        
        it("returns 0 for points in the upper left corner", function () {
          expect(component.getSlice(-1, -1)).toEqual(0);
        });
        
        it("returns 1 for points in the upper centre", function () {
          expect(component.getSlice(0, -1)).toEqual(1);
          expect(component.getSlice(299, -1)).toEqual(1);
        });
        
        it("returns 2 for points in the upper right corner", function () {
          expect(component.getSlice(300, -1)).toEqual(2);
        });
        
        it("returns 3 for points in the left centre", function () {
          expect(component.getSlice(-1, 0)).toEqual(3);
          expect(component.getSlice(-1, 199)).toEqual(3);
        });
        
        it("returns 4 for points in the central graphing area", function () {
          expect(component.getSlice(0, 0)).toEqual(4);
          expect(component.getSlice(0, 199)).toEqual(4);
          expect(component.getSlice(299, 0)).toEqual(4);
          expect(component.getSlice(299, 199)).toEqual(4);
        });
        
        it("returns 5 for points in the right centre", function () {
          expect(component.getSlice(300, 0)).toEqual(5);
          expect(component.getSlice(300, 199)).toEqual(5);
        });
        
        it("returns 6 for points in the lower left corner", function () {
          expect(component.getSlice(-1, 200)).toEqual(6);
        });
        
        it("returns 7 for points in the lower centre", function () {
          expect(component.getSlice(0, 200)).toEqual(7);
          expect(component.getSlice(299, 200)).toEqual(7);
        });
        
        it("returns 8 for points in the lower right corner", function () {
          expect(component.getSlice(300, 200)).toEqual(8);
        });
      });
      
    });
  });
});
