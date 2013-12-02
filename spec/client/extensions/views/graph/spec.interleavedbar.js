define([
  'extensions/views/graph/interleavedbar',
  'extensions/collections/collection'
],
function (InterleavedBar, Collection) {
  describe("InterleavedBarComponent", function () {
    
    var d3 = InterleavedBar.prototype.d3;

    var el, wrapper, collection, view;
    beforeEach(function () {
      el = $('<div></div>').appendTo($('body'));
      wrapper = d3.select(el[0]).append('svg').append('g');
      collection = new Collection([
        {
          testAttr:'b',
          values: new Collection([
            { b:2, name: "one"},
            { b:5, name: "two"},
            { b:8, name: "three"}
          ])
        },
        {
          testAttr:'c',
          values: new Collection([
            { b:12, name: "four"},
            { b:15, name: "five"},
            { b:18, name: "six"}
          ])
        }
      ]);
      view = new InterleavedBar({
        wrapper:wrapper,
        collection:collection,
        yStack: function (model, i) {
          return model.get('b');
        },
        blockWidth: function (model, index) {
          return this.scales.x(1) - this.scales.x(0);
        },
        graph: {
          getYPos: function (groupIndex, modelIndex) {
            var model = collection.at(groupIndex).get('values').at(modelIndex);
            return model.get('b');
          }
        },
        scales:{
          x: function (v) {
            return v * 20;
          },
          y: function (v) {
            return -v * 2;
          }
        }
      });
    });

    afterEach(function () {
      el.remove();
    });

    describe("render", function () {

      var assertSegment = function (s, v) {
        var rectX = v.x;
        var rectY = v.y;
        var rectWidth = v.width;
        var rectHeight = v.height;
        if (v.strokeWidth != null) {
          rectX += v.strokeWidth / 2;
          rectY += v.strokeWidth / 2;
          rectWidth -= v.strokeWidth;
          rectHeight -= v.strokeWidth;
        }

        expect(s.select('rect').attr('x')).toEqual(rectX.toString());
        expect(s.select('rect').attr('y')).toEqual(rectY.toString());
        expect(s.select('rect').attr('width')).toEqual(rectWidth.toString());
        expect(s.select('rect').attr('height')).toEqual(rectHeight.toString());

        expect(s.select('line').attr('y1')).toEqual(v.y.toString());
        expect(s.select('line').attr('y2')).toEqual(v.y.toString());
        expect(s.select('line').attr('x1')).toEqual(v.x.toString());
        expect(s.select('line').attr('x2')).toEqual((v.x + v.width).toString());
        if (v.text) {
          expect(s.select('text').attr('x')).toEqual(v.textX.toString());
          expect(s.select('text').attr('y')).toEqual(v.textY.toString());
          expect(s.select('text').text()).toEqual(v.text);
        }
      };

      it("renders for each model in each series", function () {
        view.blockMarginFraction = 0;
        view.barMarginFraction = 0;
        view.render();

        var segments = view.componentWrapper.selectAll('g.segment');

        expect(segments[0].length).toEqual(6);
        segments.each(function () {
          expect(d3.select(this).selectAll('rect')[0].length).toEqual(1);
          expect(d3.select(this).selectAll('line')[0].length).toEqual(1);
          expect(d3.select(this).selectAll('text')[0].length).toEqual(0);
        });
        
        var group1 = d3.select('g.group:nth-child(1)');
        assertSegment(group1.select('g.segment:nth-child(1)'), { x:  0, y:  -4, width: 10, height:  4 });
        assertSegment(group1.select('g.segment:nth-child(2)'), { x: 20, y: -10, width: 10, height: 10 });
        assertSegment(group1.select('g.segment:nth-child(3)'), { x: 40, y: -16, width: 10, height: 16 });
        
        var group2 = d3.select('g.group:nth-child(2)');
        assertSegment(group2.select('g.segment:nth-child(1)'), { x: 10, y: -24, width: 10, height: 24 });
        assertSegment(group2.select('g.segment:nth-child(2)'), { x: 30, y: -30, width: 10, height: 30 });
        assertSegment(group2.select('g.segment:nth-child(3)'), { x: 50, y: -36, width: 10, height: 36 });
      });

      it("renders segments with text labels for each model in each series", function () {
        view.blockMarginFraction = 0;
        view.barMarginFraction = 0;
        view.text = function(model, i) {
          return 'foo ' + model.get('name')
        };
        view.offsetText = -20;
        view.render();

        var segments = view.componentWrapper.selectAll('g.segment');

        expect(segments[0].length).toEqual(6);
        segments.each(function () {
          expect(d3.select(this).selectAll('rect')[0].length).toEqual(1);
          expect(d3.select(this).selectAll('line')[0].length).toEqual(1);
          expect(d3.select(this).selectAll('text')[0].length).toEqual(1);
        });

        var group1 = d3.select('g.group:nth-child(1)');
        assertSegment(group1.select('g.segment:nth-child(1)'), {
          x:  0, y:  -4, width: 10, height:  4, textX:  5, textY: -24, text: 'foo one'
        });
        assertSegment(group1.select('g.segment:nth-child(2)'), {
          x: 20, y: -10, width: 10, height: 10, textX: 25, textY: -30, text: 'foo two'
        });
        assertSegment(group1.select('g.segment:nth-child(3)'), {
          x: 40, y: -16, width: 10, height: 16, textX: 45, textY: -36, text: 'foo three'
        });
      });

      it("renders with a simulated inner stroke for each model in each series", function () {

        view.strokeAlign = 'inner';
        spyOn(view, "getStrokeWidth").andReturn(2);
        view.blockMarginFraction = 0;
        view.barMarginFraction = 0;
        view.render();

        var segments = view.componentWrapper.selectAll('g.segment');

        expect(segments[0].length).toEqual(6);
        segments.each(function () {
          expect(d3.select(this).selectAll('rect')[0].length).toEqual(1);
          expect(d3.select(this).selectAll('line')[0].length).toEqual(1);
          expect(d3.select(this).selectAll('text')[0].length).toEqual(0);
        });
        
        var group1 = d3.select('g.group:nth-child(1)');
        assertSegment(group1.select('g.segment:nth-child(1)'), { strokeWidth: 2, x:  0, y:  -4, width: 10, height:  4 });
        assertSegment(group1.select('g.segment:nth-child(2)'), { strokeWidth: 2, x: 20, y: -10, width: 10, height: 10 });
        assertSegment(group1.select('g.segment:nth-child(3)'), { strokeWidth: 2, x: 40, y: -16, width: 10, height: 16 });
        
        var group2 = d3.select('g.group:nth-child(2)');
        assertSegment(group2.select('g.segment:nth-child(1)'), { strokeWidth: 2, x: 10, y: -24, width: 10, height: 24 });
        assertSegment(group2.select('g.segment:nth-child(2)'), { strokeWidth: 2, x: 30, y: -30, width: 10, height: 30 });
        assertSegment(group2.select('g.segment:nth-child(3)'), { strokeWidth: 2, x: 50, y: -36, width: 10, height: 36 });
      });

      it("renders centre-aligned segments by default for each model in each series with gaps between series", function () {
        view.blockMarginFraction = 0.2; // 4 pixels for a block width of 20 - 2 pixels each side
        view.barMarginFraction = 0;
        view.render();

        var segments = view.componentWrapper.selectAll('g.segment');

        expect(segments[0].length).toEqual(6);
        segments.each(function () {
          expect(d3.select(this).selectAll('rect')[0].length).toEqual(1);
          expect(d3.select(this).selectAll('line')[0].length).toEqual(1);
          expect(d3.select(this).selectAll('text')[0].length).toEqual(0);
        });
        
        var group1 = d3.select('g.group:nth-child(1)');
        assertSegment(group1.select('g.segment:nth-child(1)'), { x:  2, y:  -4, width: 8, height:  4 });
        assertSegment(group1.select('g.segment:nth-child(2)'), { x: 22, y: -10, width: 8, height: 10 });
        assertSegment(group1.select('g.segment:nth-child(3)'), { x: 42, y: -16, width: 8, height: 16 });
        
        var group2 = d3.select('g.group:nth-child(2)');
        assertSegment(group2.select('g.segment:nth-child(1)'), { x: 10, y: -24, width: 8, height: 24 });
        assertSegment(group2.select('g.segment:nth-child(2)'), { x: 30, y: -30, width: 8, height: 30 });
        assertSegment(group2.select('g.segment:nth-child(3)'), { x: 50, y: -36, width: 8, height: 36 });
      });

      it("renders centre-aligned segments by default for each model in each series with gaps between bars", function () {
        view.blockMarginFraction = 0;
        view.barMarginFraction = 0.2; // 4 pixels for a block width of 20
        view.render();

        var segments = view.componentWrapper.selectAll('g.segment');

        expect(segments[0].length).toEqual(6);
        segments.each(function () {
          expect(d3.select(this).selectAll('rect')[0].length).toEqual(1);
          expect(d3.select(this).selectAll('line')[0].length).toEqual(1);
          expect(d3.select(this).selectAll('text')[0].length).toEqual(0);
        });
        
        var group1 = d3.select('g.group:nth-child(1)');
        assertSegment(group1.select('g.segment:nth-child(1)'), { x:  0, y:  -4, width: 8, height:  4 });
        assertSegment(group1.select('g.segment:nth-child(2)'), { x: 20, y: -10, width: 8, height: 10 });
        assertSegment(group1.select('g.segment:nth-child(3)'), { x: 40, y: -16, width: 8, height: 16 });
        
        var group2 = d3.select('g.group:nth-child(2)');
        assertSegment(group2.select('g.segment:nth-child(1)'), { x: 12, y: -24, width: 8, height: 24 });
        assertSegment(group2.select('g.segment:nth-child(2)'), { x: 32, y: -30, width: 8, height: 30 });
        assertSegment(group2.select('g.segment:nth-child(3)'), { x: 52, y: -36, width: 8, height: 36 });
      });

      it("renders centre-aligned segments and text for each model in each series with gaps between bars and series", function () {
        view.blockMarginFraction = 0.2; // 4 pixels for a block width of 20 - 2 pixels on each side
        view.barMarginFraction = 0.2; // 4 pixels for a block width of 20
        view.text = function(model, i) {
          return 'foo ' + model.get('name')
        };
        view.offsetText = -20;
        view.render();

        var segments = view.componentWrapper.selectAll('g.segment');

        expect(segments[0].length).toEqual(6);
        segments.each(function () {
          expect(d3.select(this).selectAll('rect')[0].length).toEqual(1);
          expect(d3.select(this).selectAll('line')[0].length).toEqual(1);
          expect(d3.select(this).selectAll('text')[0].length).toEqual(1);
        });
        
        var group1 = d3.select('g.group:nth-child(1)');
        assertSegment(group1.select('g.segment:nth-child(1)'), { x:  2, y:  -4, width: 6, height:  4, textX:  5, textY: -24, text: 'foo one' });
        assertSegment(group1.select('g.segment:nth-child(2)'), { x: 22, y: -10, width: 6, height: 10, textX: 25, textY: -30, text: 'foo two' });
        assertSegment(group1.select('g.segment:nth-child(3)'), { x: 42, y: -16, width: 6, height: 16, textX: 45, textY: -36, text: 'foo three' });
        
        var group2 = d3.select('g.group:nth-child(2)');
        assertSegment(group2.select('g.segment:nth-child(1)'), { x: 12, y: -24, width: 6, height: 24, textX: 15, textY: -44, text: 'foo four' });
        assertSegment(group2.select('g.segment:nth-child(2)'), { x: 32, y: -30, width: 6, height: 30, textX: 35, textY: -50, text: 'foo five' });
        assertSegment(group2.select('g.segment:nth-child(3)'), { x: 52, y: -36, width: 6, height: 36, textX: 55, textY: -56, text: 'foo six' });
      });
    });

    describe("onHover", function () {

      beforeEach(function() {
        view.blockMarginFraction = 0;
        view.barMarginFraction = 0;
        spyOn(collection, "selectItem");
      });

      it("selects the closest item", function () {
        view.onHover({ x: 9, y: 0 });
        expect(collection.selectItem.mostRecentCall.args).toEqual([0, 0]);
        view.onHover({ x: 11, y: 0 });
        expect(collection.selectItem.mostRecentCall.args).toEqual([1, 0]);
        view.onHover({ x: 19, y: 0 });
        expect(collection.selectItem.mostRecentCall.args).toEqual([1, 0]);
        view.onHover({ x: 21, y: 0 });
        expect(collection.selectItem.mostRecentCall.args).toEqual([0, 1]);
      });

      it("optionally toggles selection when the new item is the currently selected item", function () {
        view.collection.selectedIndex = 0;
        view.collection.selectedItem = view.collection.at(0);
        view.collection.at(0).get('values').selectItem(0);
        view.onHover({ x: 9, y: 0, toggle: true});
        expect(collection.selectItem.mostRecentCall.args).toEqual([0, 0, { toggle: true }]);
      });
    });
  });
});