define([
  'extensions/views/graph/component',
  'd3'
],
function (Component, d3) {
  describe("Component", function() {
    
    it("keeps a reference to d3 library", function() {
      var view = new Component({
        collection: {
          on: jasmine.createSpy()
        }
      });
      expect(view.d3).toBe(d3);
    });
    
    describe("initialize", function() {
      
      var graph, collection;
      beforeEach(function() {
        spyOn(Component.prototype, "onHover");
        graph = {
          on: jasmine.createSpy()
        };
        collection = {
          on: jasmine.createSpy()
        };
      });
      
      it("assigns options as object properties", function() {
        var view = new Component({
          testProperty: true,
          collection: collection
        });
        expect(view.testProperty).toBe(true);
      });
      
      it("does not listen to user interaction by default", function () {
        var view = new Component({
          graph: graph,
          collection: collection
        });
        expect(graph.on).not.toHaveBeenCalled();
      });
      
      it("listens to user interaction unconditionally when configured", function () {
        var view = new Component({
          graph: graph,
          collection: collection,
          interactive: true
        });
        expect(graph.on).toHaveBeenCalled();
        expect(graph.on.argsForCall[0][0]).toEqual('hover');
        var callback = graph.on.argsForCall[0][1];
        
        callback();
        expect(view.onHover).toHaveBeenCalled();
      });
      
      it("listens to user interaction conditionally when configured", function () {
        var view = new Component({
          graph: graph,
          collection: collection,
          interactive: function (e) {
            return e.foo === true;
          }
        });
        expect(graph.on).toHaveBeenCalled();
        expect(graph.on.argsForCall[0][0]).toEqual('hover');
        var callback = graph.on.argsForCall[0][1];
        
        callback.call(view, {
          foo: false
        });
        expect(view.onHover).not.toHaveBeenCalled();
        
        callback.call(view, {
          foo: true
        });
        expect(view.onHover).toHaveBeenCalledWith({ foo: true });
      });
      
      it("listens to selection changes in the graph collection", function () {
        var view = new Component({
          graph: graph,
          collection: collection
        });
        expect(collection.on.argsForCall[0][0]).toEqual('change:selected');
      });
    });
    
    describe("render", function () {
      var componentWrapper, wrapper, view
      beforeEach(function() {
        componentWrapper = {
          classed: jasmine.createSpy()
        };
        wrapper = {
          append: jasmine.createSpy().andReturn(componentWrapper)
        };
        view = new Component({
          wrapper: wrapper,
          collection: { on: jasmine.createSpy() }
        });
      });
      
      it("creates a group element for the component", function () {
        view.render();
        expect(wrapper.append).toHaveBeenCalledWith('g');
        expect(view.componentWrapper).toBe(componentWrapper);
        expect(componentWrapper.classed).not.toHaveBeenCalled();
      });
      
      it("creates a group element for the component with a class", function () {
        view.classed = 'foo';
        view.render();
        expect(wrapper.append).toHaveBeenCalledWith('g');
        expect(view.componentWrapper).toBe(componentWrapper);
        expect(componentWrapper.classed).toHaveBeenCalledWith('foo', true);
      });
    });
    
  });
});
