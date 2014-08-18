define([
  'client/views/graph/tooltip',
  'extensions/collections/collection'
],
function (Tooltip, Collection) {

  describe('Tooltip', function () {

    describe('onChangeSelected', function () {
      var el, tooltip, wrapper, collection;
      beforeEach(function () {
        el = $('<div></div>').appendTo($('body'));
        wrapper = Tooltip.prototype.d3.select(el[0]).append('svg').append('g');

        collection = new Collection([
          {
            x: 110,
            y: 120,
            textWidth: 100,
            modelValue: 0.84,
          },
          {
            x: 110,
            y: 120,
            textWidth: 100,
            modelValue: 0.877,
          }
        ]);

        tooltip = new Tooltip({
          el: el,
          wrapper: wrapper,
          collection: collection,
          graph: {
            valueAttr: 'modelValue',
            isOneHundredPercent: function () { return false; }
          },
          constrainToBounds: false,
          x: function (i) {
            return this.collection.at(i).get('x');
          },
          y: function (i) {
            return this.collection.at(i).get('y');
          },
          textWidth: function () {
            return this.collection.at(0).get('textWidth');
          }
        });
      });

      afterEach(function () {
        el.remove();
      });

      it('formats value as percentage on one hundred percent graph', function () {
        tooltip.render();

        tooltip.graph.isOneHundredPercent = function () { return true; };

        tooltip.onChangeSelected(collection.at(0), 0);
        expect(wrapper.select('text.tooltip-text').text()).toEqual('84%');
        expect(wrapper.select('text.tooltip-stroke').text()).toEqual('84%');
      });

      it('renders a tooltip at the position with offsets', function () {
        tooltip.render();
        tooltip.onChangeSelected(collection.at(1), 1);

        expect(wrapper.select('text.tooltip-text').text()).toEqual('0.88');
        expect(wrapper.select('text.tooltip-stroke').text()).toEqual('0.88');
        expect(wrapper.select('text.tooltip-text').attr('transform')).toEqual('translate(3, 102)');
        expect(wrapper.select('text.tooltip-stroke').attr('transform')).toEqual('translate(3, 102)');
      });

      it('hides the tooltip when unselected', function () {
        tooltip.render();

        tooltip.onChangeSelected(collection.at(1), 1);
        expect(wrapper.select('text.tooltip-text')[0][0]).not.toBeFalsy();
        expect(wrapper.select('text.tooltip-stroke')[0][0]).not.toBeFalsy();

        tooltip.onChangeSelected(null, null);
        expect(wrapper.select('text.tooltip-text')[0][0]).toBeFalsy();
        expect(wrapper.select('text.tooltip-stroke')[0][0]).toBeFalsy();
      });

      it('displays (no data) when data is null', function () {
        collection.at(1).set('modelValue', null);
        tooltip.render();
        tooltip.onChangeSelected(collection.at(1), 1);

        expect(wrapper.select('text.tooltip-stroke').text()).toEqual('(no data)');
      });

      it('displays the value returned by getValue', function () {
        tooltip.getValue = function () {
          return 'foo';
        };
        tooltip.render();
        tooltip.onChangeSelected(collection.at(1), 1);

        expect(wrapper.select('text.tooltip-stroke').text()).toEqual('foo');
      });

      it('formats using formatValue when there\'s data', function () {
        tooltip.formatValue = function (value) {
          return 'The value is ' + value + '!';
        };
        tooltip.render();
        tooltip.onChangeSelected(collection.at(1), 1);

        expect(wrapper.select('text.tooltip-stroke').text()).toEqual('The value is 0.877!');
      });

      it('returns "(no data)" when data is null', function () {
        collection.at(1).set('modelValue', null);
        tooltip.render();
        tooltip.onChangeSelected(collection.at(1), 1);

        expect(wrapper.select('text.tooltip-stroke').text()).toEqual('(no data)');
      });

    });

  });

});
