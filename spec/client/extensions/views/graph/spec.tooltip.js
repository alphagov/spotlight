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
          collection: { on: jasmine.createSpy(), fraction: function(){ return "101";} },
          graph: {
            valueAttr: "modelValue"
          },
          constrainToBounds: false,
          x: function (group, groupIndex, model, index) {
            if( Object.prototype.toString.call( model ) === '[object Array]' ) {
              model = model[0];
            }
            return model.get('x');
          },
          y: function (group, groupIndex, model, index) {
            if( Object.prototype.toString.call( model ) === '[object Array]' ) {
              model = model[0];
            }
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
          modelValue: 84,
        });

        model2 = new Model({
          x: 110,
          y: 120,
          textWidth: 100,
          modelValue: 877,
        });
      });

      afterEach(function () {
        el.remove();
      });

      it("renders nothing if the value is the sum of an array of models and noTotal set", function (){
        tooltip.noTotal = true;
        tooltip.render();

        tooltip.onChangeSelected(null, null, model, 1);
        expect(wrapper.select('text.tooltip-text')[0][0]).not.toBeFalsy();
        expect(wrapper.select('text.tooltip-stroke')[0][0]).not.toBeFalsy();

        tooltip.onChangeSelected(null, null, [model, model2], 1);
        expect(wrapper.select('text.tooltip-text')[0][0]).toBeFalsy();
        expect(wrapper.select('text.tooltip-stroke')[0][0]).toBeFalsy();
      });
      it("renders the sum of values if the model is an array of models", function (){
        tooltip.render();

        tooltip.onChangeSelected(null, null, model, 1);
        expect(wrapper.select('text.tooltip-text')[0][0]).not.toBeFalsy();
        expect(wrapper.select('text.tooltip-stroke')[0][0]).not.toBeFalsy();

        tooltip.onChangeSelected(null, null, [model, model2], 1);
        expect(wrapper.select('text.tooltip-text').text()).toEqual("961");
        expect(wrapper.select('text.tooltip-stroke').text()).toEqual("961");
      });
      it("renders no data if the value comes from an array of models which all have null data", function (){
        model = new Model({
          x: 110,
          y: 120,
          textWidth: 100,
          modelValue: null
        });

        model2 = new Model({
          x: 110,
          y: 120,
          textWidth: 100,
          modelValue: null
        });
        tooltip.render();
        tooltip.onChangeSelected(null, null, [model, model2], 1);

        expect(wrapper.select('text.tooltip-text').text()).toEqual("(no data)");
        expect(wrapper.select('text.tooltip-stroke').text()).toEqual("(no data)");
      });
      it("renders fraction of the selected model on one hundred percent graph", function (){
        tooltip.render();

        tooltip.graph.model = {
          get: function(arg){
            if(arg === 'one-hundred-percent'){
              return true;
            }
            return false;
          }
        }
        spyOn(tooltip.collection, "fraction").andReturn('101');
        tooltip.onChangeSelected(null, 2, model, 3);
        expect(wrapper.select('text.tooltip-text').text()).toEqual("101");
        expect(wrapper.select('text.tooltip-stroke').text()).toEqual("101");
        expect(tooltip.collection.fraction).toHaveBeenCalledWith(tooltip.graph.valueAttr, 2, 3);
      });

      it("renders a tooltip at the position with offsets", function () {
        tooltip.render();
        tooltip.onChangeSelected(null, null, model, 1);

        expect(wrapper.select('text.tooltip-text').text()).toEqual("84");
        expect(wrapper.select('text.tooltip-stroke').text()).toEqual("84");
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

        expect(wrapper.select('text.tooltip-stroke').text()).toEqual("The value is 84!");
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
