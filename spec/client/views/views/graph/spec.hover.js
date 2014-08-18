define([
  'client/views/graph/hover',
  'client/views/graph/graph'
],
function (Hover) {
  describe('Hover Component', function () {
    describe('events', function () {

      var graphWrapper;

      beforeEach(function () {
        graphWrapper = $('<div class="graph-wrapper"></div>');
        spyOn(Hover.prototype, 'onMouseMove');
        spyOn(Hover.prototype, 'onTouchStart');
        spyOn(Hover.prototype, 'onTouchMove');
        spyOn(Hover.prototype, 'onTouchEnd');
      });

      it('listens to mousemove events in mouse environments', function () {
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

      describe('touch events', function () {
        it('binds to touchstart', function () {
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

        it('binds to touchmove', function () {
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
            component.$el.find('.hover').trigger('touchmove');
            expect(component.onTouchMove).toHaveBeenCalled();
            expect(component.onMouseMove).not.toHaveBeenCalled();
          });
        });

        it('binds to touchend', function () {
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
            component.$el.find('.hover').trigger('touchend');
            expect(component.onTouchEnd).toHaveBeenCalled();
            expect(component.onMouseMove).not.toHaveBeenCalled();
          });
        });

      });
    });

    describe('event handlers', function () {
      var component, graphWrapper;

      beforeEach(function () {
        graphWrapper = $('<div class="graph-wrapper"></div>');
        spyOn(Hover.prototype, 'selectPoint');
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
            graphWrapper: graphWrapper,
            scaleFactor: jasmine.createSpy(),
            on: jasmine.createSpy()
          }
        });
      });

      describe('onMouseMove', function () {

        beforeEach(function () {
          jasmine.Clock.useMock();
        });

        it('calculates the mouse move position when the graph is not scaled', function () {
          spyOn(graphWrapper, 'offset').andReturn({
            left: 200,
            top: 200
          });
          component.graph.scaleFactor.andReturn(1);
          component.onMouseMove({
            pageX: 300,
            pageY: 300
          });
          expect(component.selectPoint).toHaveBeenCalledWith(90, 80);
        });

        it('calculates the mouse move position when the graph is scaled, allowing for throttling', function () {
          spyOn(graphWrapper, 'offset').andReturn({
            left: 100,
            top: 100
          });
          component.graph.scaleFactor.andReturn(0.5);
          component.onMouseMove({
            pageX: 150,
            pageY: 150
          });
          jasmine.Clock.tick(1000);
          expect(component.selectPoint).toHaveBeenCalledWith(90, 80);
        });
      });

      describe('onTouchStart', function () {
        it('records the start x/y touch position', function () {
          component.onTouchStart({
            originalEvent: {
              targetTouches: [{
                pageX: 150,
                pageY: 200
              }]
            }
          });
          expect(component.startX).toEqual(150);
          expect(component.startY).toEqual(200);
          expect(component.endX).toEqual(150);
          expect(component.endY).toEqual(200);
        });
      });

      describe('onTouchMove', function () {
        it('updates the end x/y touch position', function () {
          component.onTouchStart({
            originalEvent: {
              targetTouches: [{
                pageX: 150,
                pageY: 150
              }]
            }
          });

          expect(component.startX).toEqual(150);
          expect(component.startY).toEqual(150);
          expect(component.endX).toEqual(150);
          expect(component.endY).toEqual(150);


          component.onTouchMove({
            originalEvent: {
              targetTouches: [{
                pageX: 200,
                pageY: 200
              }]
            }
          });

          expect(component.startX).toEqual(150);
          expect(component.startY).toEqual(150);
          expect(component.endX).toEqual(200);
          expect(component.endY).toEqual(200);
        });
      });

      describe('onTouchEnd', function () {
        it('does nothing if start and end x/y are not the same', function () {
          component.startX = 299;
          component.startY = 299;
          component.endX = 300;
          component.endY = 300;
          component.onTouchEnd();
          expect(component.selectPoint).not.toHaveBeenCalled();
        });

        it('calculates the touch position when the graph is not scaled', function () {
          spyOn(graphWrapper, 'offset').andReturn({
            left: 200,
            top: 200
          });
          component.graph.scaleFactor.andReturn(1);
          component.startX = 300;
          component.startY = 300;
          component.endX = 300;
          component.endY = 300;
          component.onTouchEnd();
          expect(component.selectPoint).toHaveBeenCalledWith(90, 80, { toggle: true });
        });

        it('calculates the touch position when the graph is scaled', function () {
          spyOn(graphWrapper, 'offset').andReturn({
            left: 100,
            top: 100
          });
          component.graph.scaleFactor.andReturn(0.5);
          component.startX = 150;
          component.startY = 150;
          component.endX = 150;
          component.endY = 150;
          component.onTouchEnd();
          expect(component.selectPoint).toHaveBeenCalledWith(90, 80, { toggle: true });
        });
      });

      describe('getSlice', function () {
        var component;

        describe('with no grace pixels', function () {

          beforeEach(function () {
            component = new Hover({
              rightHandGracePixels: 0,
              collection: { on: jasmine.createSpy() },
              graph: {
                innerWidth: 300,
                innerHeight: 200
              }
            });
          });

          it('returns 0 for points in the upper left corner', function () {
            expect(component.getSlice(-1, -1)).toEqual(0);
          });

          it('returns 1 for points in the upper centre', function () {
            expect(component.getSlice(0, -1)).toEqual(1);
            expect(component.getSlice(299, -1)).toEqual(1);
          });

          it('returns 2 for points in the upper right corner', function () {
            expect(component.getSlice(300, -1)).toEqual(2);
          });

          it('returns 3 for points in the left centre', function () {
            expect(component.getSlice(-1, 0)).toEqual(3);
            expect(component.getSlice(-1, 199)).toEqual(3);
          });

          it('returns 4 for points in the central graphing area', function () {
            expect(component.getSlice(0, 0)).toEqual(4);
            expect(component.getSlice(0, 199)).toEqual(4);
            expect(component.getSlice(299, 0)).toEqual(4);
            expect(component.getSlice(299, 199)).toEqual(4);
          });

          it('returns 5 for points in the right centre', function () {
            expect(component.getSlice(300, 0)).toEqual(5);
            expect(component.getSlice(300, 199)).toEqual(5);
          });

          it('returns 6 for points in the lower left corner', function () {
            expect(component.getSlice(-1, 200)).toEqual(6);
          });

          it('returns 7 for points in the lower centre', function () {
            expect(component.getSlice(0, 200)).toEqual(7);
            expect(component.getSlice(299, 200)).toEqual(7);
          });

          it('returns 8 for points in the lower right corner', function () {
            expect(component.getSlice(300, 200)).toEqual(8);
          });

        });

        describe('with a few grace pixels on the right hand side', function () {
          beforeEach(function () {
            component = new Hover({
              rightHandGracePixels: 20,
              collection: { on: jasmine.createSpy() },
              graph: {
                innerWidth: 300,
                innerHeight: 200
              }
            });
          });

          it('returns 1 for the top middle segment if inside the grace pixels', function () {
            expect(component.getSlice(310, -1)).toEqual(1);
          });

          it('returns 2 for the top right segment if outside the grace pixels', function () {
            expect(component.getSlice(321, -1)).toEqual(2);
          });
        });

      });

    });
  });
});
