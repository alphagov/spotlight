define([
  'extensions/views/graph/tooltip',
  'extensions/models/model'
],
function (Tooltip, Model) {

  describe("Tooltip", function () {

    describe("onChangeSelected", function () {
      var el, tooltip, wrapper, model;
      beforeEach(function () {
        el = $('<div></div>').appendTo($('body'));
        wrapper = Tooltip.prototype.d3.select(el[0]).append('svg').append('g');

        tooltip = new Tooltip({
          el: el,
          wrapper: wrapper,
          collection: { on: jasmine.createSpy() },
          graph: {
            valueAttr: "modelValue"
          },
          constrainToBounds: false,
          x: function (group, groupIndex, model, index) {
            return model.get('x');
          },
          y: function (group, groupIndex, model, index) {
            return model.get('y');
          },
          textWidth: function() {
            return model.get('textWidth');
          }
        });

        model = new Model({
          x: 110,
          y: 120,
          textWidth: 100,
          modelValue: "Tooltip Text",
        });
      });

      afterEach(function () {
        el.remove();
      });

      it("renders a tooltip at the position with offsets", function () {
        tooltip.render();
        tooltip.onChangeSelected(null, null, model, 1);

        expect(wrapper.select('text.tooltip-text').text()).toEqual("Tooltip Text");
        expect(wrapper.select('text.tooltip-stroke').text()).toEqual("Tooltip Text");
        expect(wrapper.select('text.tooltip-text').attr('transform')).toEqual("translate(3, 102)");
        expect(wrapper.select('text.tooltip-stroke').attr('transform')).toEqual("translate(3, 102)");
      });

      it("hides the tooltip when unselected", function () {
        tooltip.render();

        tooltip.onChangeSelected(null, null, model, 1);
        expect(wrapper.select('text.tooltip-text')[0][0]).not.toBeFalsy();
        expect(wrapper.select('text.tooltip-stroke')[0][0]).not.toBeFalsy();

        tooltip.onChangeSelected(null, null, null, null);
        expect(wrapper.select('text.tooltip-text')[0][0]).toBeFalsy();
        expect(wrapper.select('text.tooltip-stroke')[0][0]).toBeFalsy();
      });

      it("displays (no data) when data is null", function () {
        model.set('modelValue', null);
        tooltip.render();
        tooltip.onChangeSelected(null, null, model, 1);

        expect(wrapper.select('text.tooltip-stroke').text()).toEqual("(no data)");
      });

      it("displays the value returned by getValue", function () {
        tooltip.getValue = function (group, groupIndex, model, index) {
          return 'foo';
        };
        tooltip.render();
        tooltip.onChangeSelected(null, null, model, 1);

        expect(wrapper.select('text.tooltip-stroke').text()).toEqual("foo");
      });

      it("formats using formatValue when there's data", function () {
        tooltip.formatValue = function (value) {
          return "The value is " + value + "!";
        };
        tooltip.render();
        tooltip.onChangeSelected(null, null, model, 1);

        expect(wrapper.select('text.tooltip-stroke').text()).toEqual("The value is Tooltip Text!");
      });

      it("formats using formatMissingValue when data is null", function () {
        tooltip.formatMissingValue = function () {
          return "There's no value here";
        };
        model.set('modelValue', null);
        tooltip.render();
        tooltip.onChangeSelected(null, null, model, 1);

        expect(wrapper.select('text.tooltip-stroke').text()).toEqual("There's no value here");
      });

    });

  });

});
