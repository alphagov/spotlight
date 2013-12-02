define([
  'extensions/views/graph/stackedbar',
  'extensions/collections/collection'
],
  function (StackedBar, Collection) {
    describe("StackedBarComponent", function () {
      
      describe("render", function () {
        var d3 = StackedBar.prototype.d3;

        var el, wrapper, collection, view;
        beforeEach(function () {
          el = $('<div></div>').appendTo($('body'));
          wrapper = d3.select(el[0]).append('svg').append('g');
          collection = new Collection([
            {
              testAttr:'b',
              values: new Collection([
                { a:1, b:2, name: "one"},
                { a:4, b:5, name: "two"},
                { a:7, b:8, name: "three"}
              ])
            },
            {
              testAttr:'c',
              values: new Collection([
                { a:11, b:12, name: "four"},
                { a:14, b:15, name: "five"},
                { a:17, b:18, name: "six"}
              ])
            }
          ]);
          var stack = StackedBar.prototype.d3.layout.stack()
            .values(function (group) {
              return group.get('values').models;
            })
            .y(function (model, index) {
              return model.get('b');
            });
          layers = stack(collection.models.slice());
          view = new StackedBar({
            wrapper:wrapper,
            collection:collection,
            graph: {
              layers: layers,
              getXPos: function (groupIndex, modelIndex) {
                var model = collection.at(groupIndex).get('values').at(modelIndex);
                return model.get('a');
              },
              getYPos: function (groupIndex, modelIndex) {
                var model = collection.at(groupIndex).get('values').at(modelIndex);
                return model.y0 + model.y;
              },
              getY0Pos: function (groupIndex, modelIndex) {
                var model = collection.at(groupIndex).get('values').at(modelIndex);
                return model.y0;
              }
            },
            barWidth: function(model, i) {
              return 10;
            },
            scales:{
              x: function (v) {
                return v * 2;
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

        it("renders centre-aligned segments by default for each model in each series", function () {
          view.render();

          var segments = view.componentWrapper.selectAll('g.segment');

          expect(segments[0].length).toEqual(6);
          segments.each(function () {
            expect(d3.select(this).selectAll('rect')[0].length).toEqual(1);
            expect(d3.select(this).selectAll('line')[0].length).toEqual(1);
            expect(d3.select(this).selectAll('text')[0].length).toEqual(0);
          });
          
          
          var group1 = d3.select('g.group:nth-child(1)');
          var segment1 = group1.select('g.segment:nth-child(1)');
          expect(segment1.select('rect').attr('x')).toEqual('-3');
          expect(segment1.select('rect').attr('y')).toEqual('-4');
          expect(segment1.select('rect').attr('width')).toEqual('10');
          expect(segment1.select('rect').attr('height')).toEqual('4');
          expect(segment1.select('line').attr('y1')).toEqual('-4');
          expect(segment1.select('line').attr('y2')).toEqual('-4');
          expect(segment1.select('line').attr('x1')).toEqual('-3');
          expect(segment1.select('line').attr('x2')).toEqual('7');

          var segment2 = group1.select('g.segment:nth-child(2)');
          expect(segment2.select('rect').attr('x')).toEqual('3');
          expect(segment2.select('rect').attr('y')).toEqual('-10');
          expect(segment2.select('rect').attr('width')).toEqual('10');
          expect(segment2.select('rect').attr('height')).toEqual('10');
          expect(segment2.select('line').attr('y1')).toEqual('-10');
          expect(segment2.select('line').attr('y2')).toEqual('-10');
          expect(segment2.select('line').attr('x1')).toEqual('3');
          expect(segment2.select('line').attr('x2')).toEqual('13');

          var segment3 = group1.select('g.segment:nth-child(3)');
          expect(segment3.select('rect').attr('x')).toEqual('9');
          expect(segment3.select('rect').attr('y')).toEqual('-16');
          expect(segment3.select('rect').attr('width')).toEqual('10');
          expect(segment3.select('rect').attr('height')).toEqual('16');
          expect(segment3.select('line').attr('y1')).toEqual('-16');
          expect(segment3.select('line').attr('y2')).toEqual('-16');
          expect(segment3.select('line').attr('x1')).toEqual('9');
          expect(segment3.select('line').attr('x2')).toEqual('19');
        });

        it("renders left-aligned segments for each model in each series", function () {
          view.align = 'left';
          view.render();

          var segments = view.componentWrapper.selectAll('g.segment');

          expect(segments[0].length).toEqual(6);
          segments.each(function () {
            expect(d3.select(this).selectAll('rect')[0].length).toEqual(1);
            expect(d3.select(this).selectAll('line')[0].length).toEqual(1);
            expect(d3.select(this).selectAll('text')[0].length).toEqual(0);
          });
          
          
          var group1 = d3.select('g.group:nth-child(1)');
          var segment1 = group1.select('g.segment:nth-child(1)');
          expect(segment1.select('rect').attr('x')).toEqual('2');
          expect(segment1.select('rect').attr('y')).toEqual('-4');
          expect(segment1.select('rect').attr('width')).toEqual('10');
          expect(segment1.select('rect').attr('height')).toEqual('4');
          expect(segment1.select('line').attr('y1')).toEqual('-4');
          expect(segment1.select('line').attr('y2')).toEqual('-4');
          expect(segment1.select('line').attr('x1')).toEqual('2');
          expect(segment1.select('line').attr('x2')).toEqual('12');

          var segment2 = group1.select('g.segment:nth-child(2)');
          expect(segment2.select('rect').attr('x')).toEqual('8');
          expect(segment2.select('rect').attr('y')).toEqual('-10');
          expect(segment2.select('rect').attr('width')).toEqual('10');
          expect(segment2.select('rect').attr('height')).toEqual('10');
          expect(segment2.select('line').attr('y1')).toEqual('-10');
          expect(segment2.select('line').attr('y2')).toEqual('-10');
          expect(segment2.select('line').attr('x1')).toEqual('8');
          expect(segment2.select('line').attr('x2')).toEqual('18');

          var segment3 = group1.select('g.segment:nth-child(3)');
          expect(segment3.select('rect').attr('x')).toEqual('14');
          expect(segment3.select('rect').attr('y')).toEqual('-16');
          expect(segment3.select('rect').attr('width')).toEqual('10');
          expect(segment3.select('rect').attr('height')).toEqual('16');
          expect(segment3.select('line').attr('y1')).toEqual('-16');
          expect(segment3.select('line').attr('y2')).toEqual('-16');
          expect(segment3.select('line').attr('x1')).toEqual('14');
          expect(segment3.select('line').attr('x2')).toEqual('24');
        });

        it("renders right-aligned segments for each model in each series", function () {
          view.align = 'right';
          view.render();

          var segments = view.componentWrapper.selectAll('g.segment');

          expect(segments[0].length).toEqual(6);
          segments.each(function () {
            expect(d3.select(this).selectAll('rect')[0].length).toEqual(1);
            expect(d3.select(this).selectAll('line')[0].length).toEqual(1);
            expect(d3.select(this).selectAll('text')[0].length).toEqual(0);
          });
          
          
          var group1 = d3.select('g.group:nth-child(1)');
          var segment1 = group1.select('g.segment:nth-child(1)');
          expect(segment1.select('rect').attr('x')).toEqual('-8');
          expect(segment1.select('rect').attr('y')).toEqual('-4');
          expect(segment1.select('rect').attr('width')).toEqual('10');
          expect(segment1.select('rect').attr('height')).toEqual('4');
          expect(segment1.select('line').attr('y1')).toEqual('-4');
          expect(segment1.select('line').attr('y2')).toEqual('-4');
          expect(segment1.select('line').attr('x1')).toEqual('-8');
          expect(segment1.select('line').attr('x2')).toEqual('2');

          var segment2 = group1.select('g.segment:nth-child(2)');
          expect(segment2.select('rect').attr('x')).toEqual('-2');
          expect(segment2.select('rect').attr('y')).toEqual('-10');
          expect(segment2.select('rect').attr('width')).toEqual('10');
          expect(segment2.select('rect').attr('height')).toEqual('10');
          expect(segment2.select('line').attr('y1')).toEqual('-10');
          expect(segment2.select('line').attr('y2')).toEqual('-10');
          expect(segment2.select('line').attr('x1')).toEqual('-2');
          expect(segment2.select('line').attr('x2')).toEqual('8');

          var segment3 = group1.select('g.segment:nth-child(3)');
          expect(segment3.select('rect').attr('x')).toEqual('4');
          expect(segment3.select('rect').attr('y')).toEqual('-16');
          expect(segment3.select('rect').attr('width')).toEqual('10');
          expect(segment3.select('rect').attr('height')).toEqual('16');
          expect(segment3.select('line').attr('y1')).toEqual('-16');
          expect(segment3.select('line').attr('y2')).toEqual('-16');
          expect(segment3.select('line').attr('x1')).toEqual('4');
          expect(segment3.select('line').attr('x2')).toEqual('14');
        });

        it("renders segments with text labels for each model in each series", function () {
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

          expect(d3.select('g.segment:nth-child(1) text').attr('x')).toEqual('2');
          expect(d3.select('g.segment:nth-child(1) text').attr('y')).toEqual('-24');
          expect(d3.select('g.segment:nth-child(1) text').text()).toEqual('foo one');

          expect(d3.select('g.segment:nth-child(2) text').attr('x')).toEqual('8');
          expect(d3.select('g.segment:nth-child(2) text').attr('y')).toEqual('-30');
          expect(d3.select('g.segment:nth-child(2) text').text()).toEqual('foo two');

          expect(d3.select('g.segment:nth-child(3) text').attr('x')).toEqual('14');
          expect(d3.select('g.segment:nth-child(3) text').attr('y')).toEqual('-36');
          expect(d3.select('g.segment:nth-child(3) text').text()).toEqual('foo three');
        });

        it("renders with a simulated inner stroke for each model in each series", function () {

          view.strokeAlign = 'inner';
          spyOn(view, "getStrokeWidth").andReturn(2);
          view.render();

          var segments = view.componentWrapper.selectAll('g.segment');

          var group1 = d3.select('g.group:nth-child(1)');
          var segment1 = group1.select('g.segment:nth-child(1)');
          expect(segment1.select('rect').attr('x')).toEqual('-2');
          expect(segment1.select('rect').attr('y')).toEqual('-3');
          expect(segment1.select('rect').attr('width')).toEqual('8');
          expect(segment1.select('rect').attr('height')).toEqual('2');
          expect(segment1.select('line').attr('y1')).toEqual('-4');
          expect(segment1.select('line').attr('y2')).toEqual('-4');
          expect(segment1.select('line').attr('x1')).toEqual('-3');
          expect(segment1.select('line').attr('x2')).toEqual('7');

          var segment2 = group1.select('g.segment:nth-child(2)');
          expect(segment2.select('rect').attr('x')).toEqual('4');
          expect(segment2.select('rect').attr('y')).toEqual('-9');
          expect(segment2.select('rect').attr('width')).toEqual('8');
          expect(segment2.select('rect').attr('height')).toEqual('8');
          expect(segment2.select('line').attr('y1')).toEqual('-10');
          expect(segment2.select('line').attr('y2')).toEqual('-10');
          expect(segment2.select('line').attr('x1')).toEqual('3');
          expect(segment2.select('line').attr('x2')).toEqual('13');

          var segment3 = group1.select('g.segment:nth-child(3)');
          expect(segment3.select('rect').attr('x')).toEqual('10');
          expect(segment3.select('rect').attr('y')).toEqual('-15');
          expect(segment3.select('rect').attr('width')).toEqual('8');
          expect(segment3.select('rect').attr('height')).toEqual('14');
          expect(segment3.select('line').attr('y1')).toEqual('-16');
          expect(segment3.select('line').attr('y2')).toEqual('-16');
          expect(segment3.select('line').attr('x1')).toEqual('9');
          expect(segment3.select('line').attr('x2')).toEqual('19');
        });

        describe("onChangeSelected", function () {
          it("marks segment as selected", function () {
            view.render();
            var group1 = d3.select('g.group:nth-child(1)');
            var group2 = d3.select('g.group:nth-child(2)');

            view.onChangeSelected(null, 0, null, 0);
            expect(group1.select('g.segment:nth-child(1)').attr('class')).toMatch('selected');
            expect(group1.select('g.segment:nth-child(2)').attr('class')).not.toMatch('selected');
            expect(group1.select('g.segment:nth-child(3)').attr('class')).not.toMatch('selected');
            expect(group2.select('g.segment:nth-child(1)').attr('class')).not.toMatch('selected');
            expect(group2.select('g.segment:nth-child(2)').attr('class')).not.toMatch('selected');
            expect(group2.select('g.segment:nth-child(3)').attr('class')).not.toMatch('selected');

            view.onChangeSelected(null, 1, null, 2);
            expect(group1.select('g.segment:nth-child(1)').attr('class')).not.toMatch('selected');
            expect(group1.select('g.segment:nth-child(2)').attr('class')).not.toMatch('selected');
            expect(group1.select('g.segment:nth-child(3)').attr('class')).not.toMatch('selected');
            expect(group2.select('g.segment:nth-child(1)').attr('class')).not.toMatch('selected');
            expect(group2.select('g.segment:nth-child(2)').attr('class')).not.toMatch('selected');
            expect(group2.select('g.segment:nth-child(3)').attr('class')).toMatch('selected');
          });
        });
      });
    });
  });