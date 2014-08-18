define([
  'client/views/graph/callout',
  'extensions/models/model'
],
function (Callout, Model) {
  describe('Callout Component', function () {

    describe('onChangeSelected', function () {

      var callout, model;
      beforeEach(function () {

        model = new Model({
          title: 'test title',
          fraction: 0.3,
          a: 20,
          b: 30,
          c: 'foo'
        });
        callout = new Callout({
          getHeader: jasmine.createSpy().andReturn('test header'),
          collection: { on: jasmine.createSpy() },
          graph: {
            scaleFactor: jasmine.createSpy(),
            getXPos: function () {
              return model.get('a');
            },
            getYPos: function () {
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
        spyOn(callout, 'renderContent').andCallThrough();
        callout.render();
      });

      it('hides when no model is selected', function () {
        callout.onChangeSelected(null, null);
        expect(callout.calloutEl).toHaveClass('performance-hidden');
        expect(callout.renderContent).not.toHaveBeenCalled();
      });

      it('shows when a model is selected', function () {
        callout.onChangeSelected(model, 1);
        expect(callout.calloutEl).not.toHaveClass('performance-hidden');
        expect(callout.renderContent).toHaveBeenCalled();
      });

      it('renders a callout at the correct position when graph is not scaled', function () {
        callout.graph.scaleFactor.andReturn(1);
        callout.onChangeSelected(model, 2);

        expect(callout.renderContent).toHaveBeenCalledWith(callout.calloutEl, model, undefined);
        expect(callout.calloutEl).not.toHaveClass('performance-hidden');
        expect(callout.calloutEl.css('left')).toEqual('23px'); // left margin + result of x() + offsetX
        expect(callout.calloutEl.css('top')).toEqual('43px'); // right margin + result of y() + offsetY
      });

      it('passes value attribute to renderContent if a particular group is selected', function () {
        callout.graph.scaleFactor.andReturn(1);
        callout.onChangeSelected(model, 2, { valueAttr: 'foo' });

        expect(callout.renderContent).toHaveBeenCalledWith(callout.calloutEl, model, 'foo');
      });

      it('renders a callout at the correct position when graph is scaled', function () {
        callout.graph.scaleFactor.andReturn(0.5);
        callout.onChangeSelected(model, 2);

        expect(callout.renderContent).toHaveBeenCalledWith(callout.calloutEl, model, undefined);
        expect(callout.calloutEl).not.toHaveClass('performance-hidden');
        expect(callout.calloutEl.css('left')).toEqual('8px'); // (left margin + result of x()) * scaleFactor + offsetX
        expect(callout.calloutEl.css('top')).toEqual('18px'); // (right margin + result of y()) * scaleFactor + offsetY
      });

      it('displays series title, count', function () {
        callout.onChangeSelected(model, 2);
        expect(callout.calloutEl.html()).toEqual('<h3>test header</h3><dl><dt>test title</dt><dd>20</dd></dl>');
      });

      it('displays series title, count and percentage when configured', function () {
        var testModel = new Model({
          title: 'test title',
          a: 0.2,
          a_original: 30
        });
        callout.showPercentage = true;
        callout.onChangeSelected(testModel, 2);
        expect(callout.calloutEl.html()).toEqual('<h3>test header</h3><dl><dt>test title</dt><dd>20% (30)</dd></dl>');
      });
    });
  });
});
