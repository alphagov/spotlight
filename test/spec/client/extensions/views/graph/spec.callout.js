define([
  'extensions/views/graph/callout',
  'extensions/models/model'
],
function (Callout, Model) {
  describe("Callout Component", function () {
    
    describe("onChangeSelected", function () {
      
      var callout, model, group;
      beforeEach(function() {

        group = new Model({
          title: 'test title'
        });
        
        model = new Model({
          fraction: 0.3,
          a: 20,
          b: 30,
          c: 'foo'
        })
        callout = new Callout({
          getHeader: jasmine.createSpy().andReturn('test header'),
          collection: { on: jasmine.createSpy() },
          graph: {
            scaleFactor: jasmine.createSpy(),
            getXPos: function (groupIndex, modelIndex) {
              return model.get('a');
            },
            getYPos: function (groupIndex, modelIndex) {
              return model.get('b');
            },
            valueAttr: 'a'
          },
          scales: {
            x: function (v) {
              return v;
            },
            y: function (v) {
              return v;
            }
          },
          margin: {
            left: 10,
            top: 20
          }
        });
        spyOn(callout, "renderContent").andCallThrough();
        callout.render();
      });
      
      it("hides when only a group but no item is selected", function () {
        callout.onChangeSelected('group', 1, null, null);
        expect(callout.calloutEl).toHaveClass('performance-hidden');
        expect(callout.renderContent).not.toHaveBeenCalled();
      });
      
      it("hides when all items at a specific position are selected", function () {
        callout.onChangeSelected(null, null, 'model', 1);
        expect(callout.calloutEl).toHaveClass('performance-hidden');
        expect(callout.renderContent).not.toHaveBeenCalled();
      });
      
      it("renders a callout at the correct position when graph is not scaled", function () {
        callout.graph.scaleFactor.andReturn(1);
        callout.onChangeSelected(group, 1, model, 2);
        expect(callout.renderContent).toHaveBeenCalledWith(
          callout.calloutEl, group, 1, model, 2
        );
        expect(callout.calloutEl).not.toHaveClass('performance-hidden');
        expect(callout.calloutEl.css('left')).toEqual('23px'); // left margin + result of x() + offsetX
        expect(callout.calloutEl.css('top')).toEqual('43px'); // right margin + result of y() + offsetY
      });
      
      it("renders a callout at the correct position when graph is scaled", function () {
        callout.graph.scaleFactor.andReturn(.5);
        callout.onChangeSelected(group, 1, model, 2);
        expect(callout.renderContent).toHaveBeenCalledWith(
          callout.calloutEl, group, 1, model, 2
        );
        expect(callout.calloutEl).not.toHaveClass('performance-hidden');
        expect(callout.calloutEl.css('left')).toEqual('8px'); // (left margin + result of x()) * scaleFactor + offsetX
        expect(callout.calloutEl.css('top')).toEqual('18px'); // (right margin + result of y()) * scaleFactor + offsetY
      });

      it('displays series title, count', function () {
        callout.onChangeSelected(group, 1, model, 2);
        expect(callout.calloutEl.html()).toEqual('<h3>test header</h3><dl><dt>test title</dt><dd>20</dd></dl>');
      });

      it('displays series title, count and percentage when configured', function () {
        callout.showPercentage = true;
        callout.onChangeSelected(group, 1, model, 2);
        expect(callout.calloutEl.html()).toEqual('<h3>test header</h3><dl><dt>test title</dt><dd>20 (30%)</dd></dl>');
      });
    });
  });
});
