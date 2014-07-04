define([
  'extensions/views/graph/linelabel',
  'extensions/collections/collection',
  'extensions/models/model'
],
function (LineLabel, Collection, Model) {

  describe('LineLabel Component', function () {
    describe('rendering tests', function () {

      var el, wrapper, lineLabel, collection, graph;
      beforeEach(function () {

        collection = new Collection([
          {
            _count: 10,
            _value: 20,
            '_count:percent': 0.33,
            '_value:percent': 0.67,
            'total:_count': 30,
            'abc:_count': 10,
            'def:_count': 20,
            'abc:_count:percent': 0.33,
            'def:_count:percent': 0.67
          },
          {
            _count: 20,
            _value: 30,
            '_count:percent': 0.4,
            '_value:percent': 0.6,
            'total:_count': 50,
            'abc:_count': 20,
            'def:_count': 30,
            'abc:_count:percent': 0.4,
            'def:_count:percent': 0.6
          },
          {
            _count: 30,
            _value: 30,
            '_count:percent': 0.5,
            '_value:percent': 0.5,
            'total:_count': 60,
            'abc:_count': 20,
            'def:_count': 40,
            'abc:_count:percent': 0.33,
            'def:_count:percent': 0.67
          }
        ]);

        graph = {
          innerWidth: 400,
          valueAttr: '_count',
          getLines: function () {
            return [
              { label: 'Title 1', key: '_count' },
              { label: 'Title 2', key: '_value' }
            ];
          },
          isOneHundredPercent: function () {
            return false;
          },
          modelToDate: function () {
            return '2014-01-01';
          }
        };

        el = $('<div></div>').appendTo($('body'));
        wrapper = LineLabel.prototype.d3.select(el[0]).append('svg').append('g');

        lineLabel = new LineLabel({
          interactive: false,
          showSquare: false,
          collection: collection,
          rendered: true,
          model: new Model({ period: 'week' })
        });
        lineLabel.wrapper = wrapper;
        lineLabel.offset = 100;
        lineLabel.linePaddingInner = 20;
        lineLabel.linePaddingOuter = 30;
        lineLabel.graph = graph;
        lineLabel.margin = {
          top: 100,
          right: 200,
          bottom: 300,
          left: 400
        };
        lineLabel.positions = [
          { ideal: 30, min: 30, size: 20, key: '_count' },
          { ideal: 80, min: 80, size: 30, key: '_value' }
        ];
        spyOn(lineLabel, 'setLabelPositions');
      });

      afterEach(function () {
        el.remove();
      });

      describe('render', function () {

        it('renders a label with text and line', function () {
          lineLabel.render();
          var textLabels = lineLabel.$el.find('figcaption li');
          expect(textLabels.length).toEqual(2);

          expect(textLabels.eq(0).find('.label-title')).toHaveText('Title 1');
          expect(textLabels.eq(0).prop('class')).toEqual('label0');

          expect(textLabels.eq(1).find('.label-title')).toHaveText('Title 2');
          expect(textLabels.eq(1).prop('class')).toEqual('label1');

          var lines = wrapper.selectAll('line');
          expect(lines[0].length).toEqual(2);
        });

        it('adds custom classes to line labels', function () {
          lineLabel.graph.getLines = function () {
            return [
              { label: 'Title 1', key: '_count', className: 'foo' },
              { label: 'Title 2', key: '_count', className: 'bar' }
            ];
          };
          lineLabel.render();

          var textLabels = lineLabel.$el.find('figcaption li');

          expect(textLabels.eq(0).prop('class')).toEqual('label0 foo');
          expect(textLabels.eq(1).prop('class')).toEqual('label1 bar');
        });

        it('adds timeshift class to line labels for timeshifted lines', function () {
          lineLabel.graph.getLines = function () {
            return [
              { label: 'Title 1', key: '_count', timeshift: 52 },
              { label: 'Title 2', key: '_count' }
            ];
          };
          lineLabel.render();

          var textLabels = lineLabel.$el.find('figcaption li');

          expect(typeof textLabels.eq(0).prop('class')).toEqual('string');
          expect(textLabels.eq(0).prop('class')).toEqual('label0 timeshift');
        });

        it('renders a label with correct WAI-ARIA attributes', function () {
          lineLabel.render();
          var lineLabelElement = lineLabel.$el.find('figcaption');
          expect(lineLabelElement.attr('role')).toEqual('presentation');
          expect(lineLabelElement.attr('aria-hidden')).toEqual('true');
        });

        it('renders a label with squares', function () {
          lineLabel.showSquare = true;
          lineLabel.render();

          expect(lineLabel.$el.find('figcaption ol')).toHaveClass('squares');
        });

        it('renders links when enabled and lines have href attributes', function () {
          lineLabel.graph.getLines = function () {
            return [
              { label: 'Title 1', key: '_count', href: '/link1' },
              { label: 'Title 2', key: '_count', href: '/link2' }
            ];
          };
          lineLabel.render();
          expect(lineLabel.$el.find('figcaption ol')).toHaveClass('has-links');
          var links = lineLabel.$el.find('figcaption li a');
          expect(links.length).toEqual(2);
          lineLabel.render();
          expect(links.eq(0).attr('href')).toEqual('/link1');
          expect(links.eq(1).attr('href')).toEqual('/link2');
        });

        it('renders a label with additional value text showing total value', function () {
          lineLabel.render();

          var labels = lineLabel.$el.find('figcaption ol li');
          var label1 = labels.eq(0);
          var label2 = labels.eq(1);

          expect(label1.find('span.value')).toHaveText('60');
          expect(label2.find('span.value')).toHaveText('80');
        });

        it('does not render percentages if there is no total line', function () {
          lineLabel.render();

          var labels = lineLabel.$el.find('figcaption ol li');
          var label1 = labels.eq(0);
          var label2 = labels.eq(1);

          expect(label1.find('span.percentage')).not.toExist();
          expect(label2.find('span.percentage')).not.toExist();
        });

        it('renders percentages if there is a total line', function () {
          lineLabel.graph.getLines = function () {
            return [
              { label: 'Title 1', key: 'total:_count' },
              { label: 'Title 2', key: 'abc:_count' },
              { label: 'Title 3', key: 'def:_count' }
            ];
          };
          lineLabel.render();

          var labels = lineLabel.$el.find('figcaption ol li');
          var label1 = labels.eq(0);
          var label2 = labels.eq(1);
          var label3 = labels.eq(2);

          expect(label1.find('span.percentage')).toHaveText('(100%)');
          expect(label2.find('span.percentage')).toHaveText('(35.7%)');
          expect(label3.find('span.percentage')).toHaveText('(64.3%)');
        });

        it('renders links and additional value text', function () {
          lineLabel.graph.getLines = function () {
            return [
              { label: 'Title 1', key: '_count', href: '/link1' },
              { label: 'Title 2', key: '_value', href: '/link2' }
            ];
          };
          lineLabel.render();

          var link1 = lineLabel.$el.find('figcaption ol li a').eq(0);
          expect(link1.text()).toEqual('Title 1');
          var link2 = lineLabel.$el.find('figcaption ol li a').eq(1);
          expect(link2.text()).toEqual('Title 2');
          var spanValues = lineLabel.$el.find('figcaption ol li span.value');
          expect(spanValues.length).toEqual(2);
        });

      });

      describe('event handling', function () {
        var el, wrapper, lineLabel, options;
        beforeEach(function () {

          el = $('<div></div>').appendTo($('body'));
          wrapper = LineLabel.prototype.d3.select(el[0]).append('svg').append('g');
          options = {
            wrapper: wrapper,
            collection: collection,
            interactive: false,
            graph: graph,
            margin: {
              top: 100,
              right: 200,
              bottom: 300,
              left: 400
            },
            positions: [
              { ideal: 30, min: 30, size: 20 },
              { ideal: 80, min: 80, size: 30 }
            ],
            rendered: true,
            model: new Model()
          };
          spyOn(LineLabel.prototype, 'setLabelPositions');
        });

        afterEach(function () {
          el.remove();
        });

        describe('events', function () {
          it('listens for mousemove events for links on non-touch devices', function () {
            LineLabel.prototype.modernizr = { touch: false };
            lineLabel = new LineLabel(options);
            lineLabel.render();
            lineLabel.$el.find('li').eq(0).trigger('mousemove');
            expect(collection.selectedIndex).toBe(0);

            $('body').trigger('mousemove');
            expect(collection.selectedIndex).toBe(null);
          });

          it('listens for touchstart events for links on touch devices', function () {
            LineLabel.prototype.modernizr = { touch: true };
            lineLabel = new LineLabel(options);
            lineLabel.render();
            lineLabel.$el.find('li').eq(1).trigger('touchstart');
            expect(collection.selectedIndex).toBe(1);

            $('body').trigger('touchstart');
            expect(collection.selectedIndex).toBe(null);
          });
        });
      });

      describe('onChangeSelected', function () {
        var hasClass = function (selection, className) {
          return _.contains(
            selection.attr('class').split(' '),
            className
          );
        };

        it('marks selected label and line as selected and others as not selected', function () {
          lineLabel.render();
          var littleLines = wrapper.select('.labels');
          var labels = lineLabel.$el.find('figcaption ol li');
          lineLabel.onChangeSelected(collection.at(0), 0, { valueAttr: '_value' });
          expect(hasClass(labels.eq(0), 'selected')).toBe(false);
          expect(hasClass(labels.eq(1), 'selected')).toBe(true);
          expect(hasClass(labels.eq(0), 'not-selected')).toBe(true);
          expect(hasClass(labels.eq(1), 'not-selected')).toBe(false);
          expect(hasClass(littleLines.select('line:nth-child(1)'), 'selected')).toBe(false);
          expect(hasClass(littleLines.select('line:nth-child(2)'), 'selected')).toBe(true);
          expect(hasClass(littleLines.select('line:nth-child(1)'), 'not-selected')).toBe(true);
          expect(hasClass(littleLines.select('line:nth-child(2)'), 'not-selected')).toBe(false);
          lineLabel.onChangeSelected(collection.at(0), 0, { valueAttr: '_count' });
          expect(hasClass(labels.eq(0), 'selected')).toBe(true);
          expect(hasClass(labels.eq(1), 'selected')).toBe(false);
          expect(hasClass(labels.eq(0), 'not-selected')).toBe(false);
          expect(hasClass(labels.eq(1), 'not-selected')).toBe(true);
          expect(hasClass(littleLines.select('line:nth-child(1)'), 'selected')).toBe(true);
          expect(hasClass(littleLines.select('line:nth-child(2)'), 'selected')).toBe(false);
          expect(hasClass(littleLines.select('line:nth-child(1)'), 'not-selected')).toBe(false);
          expect(hasClass(littleLines.select('line:nth-child(2)'), 'not-selected')).toBe(true);
          lineLabel.onChangeSelected(null, null);
          expect(hasClass(labels.eq(0), 'selected')).toBe(false);
          expect(hasClass(labels.eq(1), 'selected')).toBe(false);
          expect(hasClass(labels.eq(0), 'not-selected')).toBe(false);
          expect(hasClass(labels.eq(1), 'not-selected')).toBe(false);
          expect(hasClass(littleLines.select('line:nth-child(1)'), 'selected')).toBe(false);
          expect(hasClass(littleLines.select('line:nth-child(2)'), 'selected')).toBe(false);
          expect(hasClass(littleLines.select('line:nth-child(1)'), 'not-selected')).toBe(false);
          expect(hasClass(littleLines.select('line:nth-child(2)'), 'not-selected')).toBe(false);
        });

        it('displays the values for the current selection', function () {
          lineLabel.render();

          var figcaption = lineLabel.$el.find('figcaption');

          collection.selectItem(1);
          expect(figcaption.find('li').eq(0).find('.value')).toHaveText('20');
          expect(figcaption.find('li').eq(1).find('.value')).toHaveText('30');
          expect(figcaption.find('li').eq(0).find('.percentage')).not.toExist();
          expect(figcaption.find('li').eq(1).find('.percentage')).not.toExist();

          collection.selectItem(null);
          expect(figcaption.find('li').eq(0).find('.value')).toHaveText('60');
          expect(figcaption.find('li').eq(1).find('.value')).toHaveText('80');
          expect(figcaption.find('li').eq(0).find('.percentage')).not.toExist();
          expect(figcaption.find('li').eq(1).find('.percentage')).not.toExist();
        });

        it('displays percentages if there is a total line', function () {
          lineLabel.graph.getLines = function () {
            return [
              { label: 'Title 1', key: 'total:_count' },
              { label: 'Title 2', key: 'abc:_count' },
              { label: 'Title 3', key: 'def:_count' }
            ];
          };

          lineLabel.render();

          var figcaption = lineLabel.$el.find('figcaption');

          collection.selectItem(2);
          expect(figcaption.find('li').eq(1).find('.percentage')).toHaveText('(33%)');
          expect(figcaption.find('li').eq(2).find('.percentage')).toHaveText('(67%)');

          collection.selectItem(1);
          expect(figcaption.find('li').eq(1).find('.percentage')).toHaveText('(40%)');
          expect(figcaption.find('li').eq(2).find('.percentage')).toHaveText('(60%)');

          collection.selectItem(null);
          expect(figcaption.find('li').eq(1).find('.percentage')).toHaveText('(35.7%)');
          expect(figcaption.find('li').eq(2).find('.percentage')).toHaveText('(64.3%)');
        });

        it('displays (no data) when the current selection is null', function () {
          collection.at(0).set('_count', null).set('_count:percent', null);
          collection.at(0).set('_value', null).set('_value:percent', null);
          lineLabel.showTimePeriod = true;
          lineLabel.render();

          var figcaption = lineLabel.$el.find('figcaption');

          collection.selectItem(0);
          expect(figcaption.find('li').eq(0).find('.no-data')).toHaveText('(no data)');
          expect(figcaption.find('li').eq(1).find('.no-data')).toHaveText('(no data)');

        });

      });

    });

    describe('setLabelPositions', function () {
      var el, wrapper, lineLabel, graph, collection,
          figcaption, labelWrapper, selection, enterSelection;
      beforeEach(function () {
        collection = new Collection([
          { a: 1, b: 2 },
          { a: 4, b: 5 },
          { a: 7, b: 8 }
        ]);

        var yScale = jasmine.createSpy();
        yScale.plan = function (val) {
          return val * val;
        };
        graph = {
          valueAttr: 'a',
          innerWidth: 100,
          innerHeight: 100,
          getYPos: function (modelIndex, attr) {
            return collection.at(modelIndex).get(attr);
          },
          getY0Pos: function () {
            return 0;
          }
        };
        lineLabel = new LineLabel({
          scales: {
            y: yScale
          },
          interactive: false,
          collection: collection,
          margin: {
            top: 0,
            right: 0
          },
          offset: 100,
          linePaddingInner: 20,
          linePaddingOuter: 30,
          graph: graph
        });

        el = $('<div></div>').appendTo($('body'));
        wrapper = lineLabel.d3.select(el[0]);

        figcaption = wrapper.selectAll('figcaption').data(['one-figcaption']);
        figcaption.enter().append('figcaption').attr('class', 'legend');

        labelWrapper = figcaption.selectAll('ol').data(['one-wrapper']);
        labelWrapper.enter().append('ol');

        // Set the height of the li for cross-browser test compatibility
        selection = labelWrapper.selectAll('li').data([
          { key: 'a' },
          { key: 'b' }
        ]);
        enterSelection = selection.enter().append('li').attr('style', 'display:block;height:20px;position:absolute;');

        spyOn(lineLabel, 'calcPositions').andReturn([
          { min: 20, key: 'a' },
          { min: 30, key: 'b' }
        ]);
      });

      afterEach(function () {
        el.remove();
      });

      it('positions labels vertically so they do not collide', function () {
        lineLabel.setLabelPositions(figcaption.selectAll('li'));
        expect(lineLabel.calcPositions).toHaveBeenCalled();
        var startPositions = lineLabel.calcPositions.argsForCall[0][0];
        expect(lineLabel.scales.y).toHaveBeenCalledWith(7);
        expect(startPositions[0]).toEqual({
          ideal: 49, // yScale was applied to '_count' attribute of last element in line 'a'
          size: 20,
          key: 'a',
        });
        expect(lineLabel.scales.y).toHaveBeenCalledWith(8);
        expect(startPositions[1]).toEqual({
          ideal: 64, // yScale was applied to '_count' attribute of last element in line 'b'
          size: 20,
          key: 'b'
        });

        expect($(wrapper.selectAll('li')[0][0]).prop('style').top).toEqual('20px');
        expect($(wrapper.selectAll('li')[0][1]).prop('style').top).toEqual('30px');
      });

      it('uses the last non-null value for positioning in overlay configuration', function () {
        collection.last().set('a', null).set('b', null);
        lineLabel.setLabelPositions(wrapper.selectAll('li'));
        expect(lineLabel.calcPositions).toHaveBeenCalled();
        var startPositions = lineLabel.calcPositions.argsForCall[0][0];
        expect(lineLabel.scales.y).toHaveBeenCalledWith(4);
        expect(startPositions[0]).toEqual({
          ideal: 16, // yScale was applied to '_count' attribute of penultimate element in line 'a'
          size: 20,
          key: 'a'
        });
        expect(lineLabel.scales.y).toHaveBeenCalledWith(5);
        expect(startPositions[1]).toEqual({
          ideal: 25, // yScale was applied to '_count' attribute of penultimate element in line 'b'
          size: 20,
          key: 'b'
        });
      });

      it('sorts elements by ideal position before calculating positions', function () {
        collection.last().set('a', 8);
        collection.last().set('b', 4);
        lineLabel.setLabelPositions(wrapper.selectAll('li'));
        var startPositions = lineLabel.calcPositions.argsForCall[0][0];
        expect(startPositions[0].key).toEqual('b');
        expect(startPositions[1].key).toEqual('a');
      });

    });

    describe('renderLines', function () {
      var el, componentWrapper, lineLabel;
      beforeEach(function () {
        lineLabel = new LineLabel({
          interactive: false,
          collection: {
            on: jasmine.createSpy()
          },
        });
        lineLabel.offset = 100;
        lineLabel.linePaddingInner = 20;
        lineLabel.linePaddingOuter = 30;

        el = $('<div></div>').appendTo($('body'));
        componentWrapper = lineLabel.d3.select(el[0]).append('svg').append('g');
        var collection = new Collection([
          { y: 30, yLabel: 40, id: 'foo' },
          { y: 80, yLabel: 80, id: 'bar' }
        ]);
        lineLabel.positions = [
          { ideal: 30, min: 40 },
          { ideal: 80, min: 80 }
        ];
        componentWrapper.selectAll('g.label').data(collection.models)
          .enter().append('g').attr('class', 'label').append('line');
        lineLabel.componentWrapper = componentWrapper;
      });

      afterEach(function () {
        el.remove();
      });

      it('renders lines to connect last items with labels', function () {
        lineLabel.renderLines();
        var line1 = d3.select(componentWrapper.selectAll('line')[0][0]);
        var line2 = d3.select(componentWrapper.selectAll('line')[0][1]);
        expect(parseFloat(line1.attr('x1'))).toEqual(-80);
        expect(parseFloat(line1.attr('x2'))).toEqual(-30);
        expect(parseFloat(line1.attr('y1'))).toEqual(30);
        expect(parseFloat(line1.attr('y2'))).toEqual(40);
        expect(parseFloat(line2.attr('x1'))).toEqual(-80);
        expect(parseFloat(line2.attr('x2'))).toEqual(-30);
        expect(parseFloat(line2.attr('y1'))).toEqual(80);
        expect(parseFloat(line2.attr('y2'))).toEqual(80);
      });

      it('displays straight lines with "crisp" option', function () {
        lineLabel.renderLines();
        var line1 = d3.select(componentWrapper.selectAll('line')[0][0]);
        var line2 = d3.select(componentWrapper.selectAll('line')[0][1]);
        expect(line1.attr('class')).toBeFalsy();
        expect(line2.attr('class')).toEqual('crisp');
      });
    });

    describe('getYIdeal', function () {

      var line, collection;
      beforeEach(function () {
        collection = new Collection([
          { value: 1, count: 10 },
          { value: 2, count: 20 },
          { value: 3, count: 30 },
          { value: null, count: 40 },
        ]);
        line = new LineLabel({
          interactive: false,
          collection: collection,
          graph: {
            getYPos: function (index, attr) {
              return collection.at(index).get(attr);
            }
          }
        });
      });

      it('returns y value of last non-null value', function () {
        expect(line.getYIdeal('value')).toEqual(3);
        expect(line.getYIdeal('count')).toEqual(40);
      });

    });

    describe('calcPositions', function () {

      var line;
      beforeEach(function () {
        line = new LineLabel({
          interactive: false,
          collection: {
            on: jasmine.createSpy()
          }
        });
      });

      it('places non-adjacent items at their ideal positions when possible', function () {
        var initial = [
          { ideal:  0, size: 10 },
          { ideal: 40, size: 20 },
          { ideal: 80, size: 20 }
        ];
        var result = line.calcPositions(initial);
        expect(result[0].min).toEqual(0);
        expect(result[1].min).toEqual(40);
        expect(result[2].min).toEqual(80);
      });

      it('places adjacent items at their ideal positions when possible', function () {
        var initial = [
          { ideal:  0, size: 10 },
          { ideal: 10, size: 20 },
          { ideal: 30, size: 20 }
        ];
        var result = line.calcPositions(initial);
        expect(result[0].min).toEqual(0);
        expect(result[1].min).toEqual(10);
        expect(result[2].min).toEqual(30);
      });

      it('places items as close to their ideal positions as possible', function () {
        var initial = [
          { ideal:  5, size: 10 },
          { ideal: 10, size: 20 },
          { ideal: 25, size: 20 }
        ];
        var result = line.calcPositions(initial);
        expect(Math.round(result[0].min)).toEqual(0);
        expect(Math.round(result[1].min)).toEqual(10);
        expect(Math.round(result[2].min)).toEqual(30);
      });

      it('places multiple clusters of items as close to their ideal positions as possible', function () {
        var initial = [
          { ideal:  4, size: 10 },
          { ideal: 10, size: 20 },
          { ideal: 30, size: 20 },
          { ideal: 40, size: 20 }
        ];
        var result = line.calcPositions(initial);
        expect(Math.round(result[0].min)).toEqual(-2);
        expect(Math.round(result[1].min)).toEqual(8);
        expect(Math.round(result[2].min)).toEqual(28);
        expect(Math.round(result[3].min)).toEqual(48);
      });

      it('keeps items within minimum bounds', function () {
        var initial = [
          { ideal:  5, size: 10 },
          { ideal: 10, size: 20 },
          { ideal: 25, size: 20 }
        ];
        var bounds = { min: 5, max: 100 };
        var result = line.calcPositions(initial, bounds);
        expect(Math.round(result[0].min)).toEqual(5);
        expect(Math.round(result[1].min)).toEqual(15);
        expect(Math.round(result[2].min)).toEqual(35);
      });

      it('keeps items within minimum bounds', function () {
        var initial = [
          { ideal:  5, size: 10 },
          { ideal: 10, size: 20 },
          { ideal: 25, size: 20 }
        ];
        var bounds = { min: -100, max: 40 };
        var result = line.calcPositions(initial, bounds);
        expect(Math.round(result[0].min)).toEqual(-10);
        expect(Math.round(result[1].min)).toEqual(0);
        expect(Math.round(result[2].min)).toEqual(20);
      });

      it('overlaps items as necessary if available space is not sufficient', function () {
        var initial = [
          { ideal:  5, size: 10 },
          { ideal: 10, size: 20 },
          { ideal: 25, size: 20 }
        ];
        var bounds = { min: 5, max: 50 };
        var result = line.calcPositions(initial, bounds);
        expect(Math.round(result[0].min)).toEqual(5);
        expect(Math.round(result[1].min)).toEqual(14);
        expect(Math.round(result[2].min)).toEqual(32);
      });
    });
  });

});
