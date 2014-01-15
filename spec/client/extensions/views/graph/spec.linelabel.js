define([
  'extensions/views/graph/linelabel',
  'extensions/collections/matrix'
],
function (LineLabel, Collection) {

  describe("LineLabel Component", function () {
    describe("rendering tests", function () {

      var el, wrapper, lineLabel, collection;
      beforeEach(function() {
        var TestCollection = Collection.extend({
          parse: function (response) {
            return response;
          }
        });

        collection = new TestCollection();
        collection.reset([
          { y: 30, yLabel: 30, title: 'Title 1', id: 'id1', href: '/link1', values: [
            { _count: 10 }, { _count: 20 }, { _count: 30, _start_at: collection.getMoment('2013-08-26T00:00:00+00:00'), _end_at: collection.getMoment('2013-09-02T00:00:00+00:00') }
          ] },
          { y: 80, yLabel: 80, title: 'Title 2', id: 'id2', href: '/link2', values: [
            { _count: 60 }, { _count: 70 }, { _count: 80, _start_at: collection.getMoment('2013-08-26T00:00:00+00:00'), _end_at: collection.getMoment('2013-09-02T00:00:00+00:00') }
          ] }
        ], {parse: true});

        el = $('<div></div>').appendTo($('body'));
        wrapper = LineLabel.prototype.d3.select(el[0]).append('svg').append('g');

        lineLabel = new LineLabel({
          interactive: false,
          showSquare: false,
          collection: collection,
          rendered: true
        });
        lineLabel.wrapper = wrapper;
        lineLabel.offset = 100;
        lineLabel.linePaddingInner = 20;
        lineLabel.linePaddingOuter = 30;
        lineLabel.graph = {
          innerWidth: 400,
          valueAttr: '_count'
        };
        lineLabel.margin = {
          top: 100,
          right: 200,
          bottom: 300,
          left: 400
        };
        lineLabel.positions = [
          { ideal: 30, min: 30, size: 20 },
          { ideal: 80, min: 80, size: 30 }
        ];
        spyOn(lineLabel, "setLabelPositions");
      });

      afterEach(function() {
        el.remove();
      });

      describe("render", function () {
        it("renders a label with text and line", function () {
          lineLabel.render();
          var textLabels = lineLabel.$el.find('figcaption li');
          expect(textLabels.length).toEqual(2);

          expect(textLabels.eq(0)).toHaveText('Title 1');
          expect(textLabels.eq(0).prop('class')).toEqual('label0');

          expect(textLabels.eq(1)).toHaveText('Title 2');
          expect(textLabels.eq(1).prop('class')).toEqual('label1');

          var lines = wrapper.selectAll('line');
          expect(lines[0].length).toEqual(2);
        });

        it('renders a label with correct WAI-ARIA attributes', function () {
          lineLabel.render();
          var lineLabelElement = lineLabel.$el.find('figcaption');
          expect(lineLabelElement.attr('role')).toEqual('presentation');
          expect(lineLabelElement.attr('aria-hidden')).toEqual('true');
        });

        it("renders a label with squares", function () {
          lineLabel.showSquare = true;
          lineLabel.render();

          expect(lineLabel.$el.find('figcaption ol')).toHaveClass('squares');
        });

        it("does not render links, values, percentages or timeperiods by default", function () {
          lineLabel.render();
          expect(lineLabel.$el.find('figcaption li a').length).toEqual(0);
          expect(lineLabel.$el.find('figcaption li span.value').length).toEqual(0);
          expect(lineLabel.$el.find('figcaption li span.percentage').length).toEqual(0);
          expect(lineLabel.$el.find('figcaption .summary span.timeperiod').length).toEqual(0);
        });

        it("renders links when enabled", function () {
          lineLabel.attachLinks = true;
          lineLabel.render();
          expect(lineLabel.$el.find('figcaption ol')).toHaveClass('has-links');
          var links = lineLabel.$el.find('figcaption li a');
          expect(links.length).toEqual(2);
          lineLabel.render();
          expect(links.eq(0).attr('href')).toEqual('/link1');
          expect(links.eq(1).attr('href')).toEqual('/link2');
        });

        it("renders a label with additional value text when enabled", function () {
          lineLabel.showValues = true;
          lineLabel.render();

          var labels = lineLabel.$el.find('figcaption ol li');
          var label1 = labels.eq(0);
          var label2 = labels.eq(1);

          expect(label1.find('span.value')).toHaveText('60');
          expect(label2.find('span.value')).toHaveText('210');
        });

        it("renders links and additional value text when selected", function () {
          lineLabel.attachLinks = true;
          lineLabel.showValues = true;
          lineLabel.render();

          var link1 = lineLabel.$el.find('figcaption ol li a').eq(0);
          expect(link1.text()).toEqual('Title 1');
          var link2 = lineLabel.$el.find('figcaption ol li a').eq(1);
          expect(link2.text()).toEqual('Title 2');
          var spanValues = lineLabel.$el.find('figcaption ol li span.value');
          expect(spanValues.length).toEqual(2);
        });

        it("renders a label with additional value text and percentage when enabled", function () {
          lineLabel.showValues = true;
          lineLabel.showValuesPercentage = true;
          lineLabel.render();
          var labels = lineLabel.$el.find('figcaption ol li');
          var label1 = labels.eq(0);
          var label2 = labels.eq(1);
          expect(label1.find('span.percentage')).toHaveText('(22%)');
          expect(label2.find('span.percentage')).toHaveText('(78%)');
        });

        it("renders a summary label when enabled", function () {
          lineLabel.showSummary = true;
          lineLabel.showValues = true;
          lineLabel.showValuesPercentage = true;
          lineLabel.render();
          var summary = lineLabel.$el.find('figcaption .summary');
          expect(summary.find('span.title')).toHaveText('Total');
          expect(summary.find('span.value')).toHaveText('270');
          expect(summary.find('span.percentage')).toHaveText('(100%)');
        });

        it("renders a time period label when enabled", function () {
          lineLabel.showSummary = true;
          lineLabel.showTimePeriod = true;
          lineLabel.render();
          var summary = lineLabel.$el.find('figcaption .summary');
          expect(summary.find('span.timeperiod')).toHaveText('last 3 weeks');
        });
      });

      describe("event handling", function () {
        var el, wrapper, lineLabel, options;
        beforeEach(function() {

          el = $('<div></div>').appendTo($('body'));
          wrapper = LineLabel.prototype.d3.select(el[0]).append('svg').append('g');
          options = {
            wrapper: wrapper,
            collection: collection,
            interactive: false,
            attachLinks: true,
            graph: {
              innerWidth: 400
            },
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
            rendered: true
          };
          spyOn(LineLabel.prototype, "setLabelPositions");
        });

        afterEach(function() {
          el.remove();
        });

        describe("events", function () {
          it("listens for mousemove events for links on non-touch devices", function () {
            LineLabel.prototype.modernizr = { touch: false };
            lineLabel = new LineLabel(options);
            lineLabel.render();
            lineLabel.$el.find('a').eq(0).trigger('mousemove');
            expect(collection.selectedIndex).toBe(0);

            $('body').trigger('mousemove');
            expect(collection.selectedIndex).toBe(null);
          });

          it("listens for touchstart events for links on touch devices", function () {
            LineLabel.prototype.modernizr = { touch: true };
            lineLabel = new LineLabel(options);
            lineLabel.render();
            lineLabel.$el.find('a').eq(1).trigger('touchstart');
            expect(collection.selectedIndex).toBe(1);

            $('body').trigger('touchstart');
            expect(collection.selectedIndex).toBe(null);
          });
        });
      });

      describe("onChangeSelected", function () {
        var hasClass = function (selection, className) {
          return _.contains(
            selection.attr('class').split(' '),
            className
          );
        };

        it("marks selected label and line as selected and others as not selected", function () {
          lineLabel.render();
          var littleLines = wrapper.select('.labels');
          var labels = lineLabel.$el.find('figcaption ol li');
          lineLabel.onChangeSelected(collection.at(1), 1);
          expect(hasClass(labels.eq(0), 'selected')).toBe(false);
          expect(hasClass(labels.eq(1), 'selected')).toBe(true);
          expect(hasClass(labels.eq(0), 'not-selected')).toBe(true);
          expect(hasClass(labels.eq(1), 'not-selected')).toBe(false);
          expect(hasClass(littleLines.select('line:nth-child(1)'), 'selected')).toBe(false);
          expect(hasClass(littleLines.select('line:nth-child(2)'), 'selected')).toBe(true);
          expect(hasClass(littleLines.select('line:nth-child(1)'), 'not-selected')).toBe(true);
          expect(hasClass(littleLines.select('line:nth-child(2)'), 'not-selected')).toBe(false);
          lineLabel.onChangeSelected(collection.at(0), 0);
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

        it("displays the values for the current selection", function () {
          lineLabel.showValues = true;
          lineLabel.showValuesPercentage = true;
          lineLabel.showSummary = true;
          lineLabel.showTimePeriod = true;
          lineLabel.render();

          var figcaption = lineLabel.$el.find('figcaption');

          collection.selectItem(null, 2);
          expect(figcaption.find('.summary .value')).toHaveText('110');
          expect(figcaption.find('.summary .percentage')).toHaveText('(100%)');
          expect(figcaption.find('.summary .timeperiod')).toHaveText('26 Aug to 1 Sep 2013');
          expect(figcaption.find('li').eq(0).find('.value')).toHaveText('30');
          expect(figcaption.find('li').eq(0).find('.percentage')).toHaveText('(27%)');
          expect(figcaption.find('li').eq(1).find('.value')).toHaveText('80');
          expect(figcaption.find('li').eq(1).find('.percentage')).toHaveText('(73%)');

          collection.selectItem(null, null);
          expect(figcaption.find('.summary .value')).toHaveText('270');
          expect(figcaption.find('.summary .percentage')).toHaveText('(100%)');
          expect(figcaption.find('.summary .timeperiod')).toHaveText('last 3 weeks');
          expect(figcaption.find('li').eq(0).find('.value')).toHaveText('60');
          expect(figcaption.find('li').eq(0).find('.percentage')).toHaveText('(22%)');
          expect(figcaption.find('li').eq(1).find('.value')).toHaveText('210');
          expect(figcaption.find('li').eq(1).find('.percentage')).toHaveText('(78%)');
        });

        it("displays (no data) when the current selection is null", function () {
          collection.at(0).get('values').at(2).set('_count', null);
          lineLabel.showValues = true;
          lineLabel.showValuesPercentage = true;
          lineLabel.showSummary = true;
          lineLabel.showTimePeriod = true;
          lineLabel.render();

          var figcaption = lineLabel.$el.find('figcaption');

          collection.selectItem(null, 2);
          expect(figcaption.find('.summary .value')).toHaveText('80');
          expect(figcaption.find('.summary .percentage')).toHaveText('(100%)');
          expect(figcaption.find('.summary .timeperiod')).toHaveText('26 Aug to 1 Sep 2013');
          expect(figcaption.find('li').eq(0).find('.no-data')).toHaveText('(no data)');
          expect(figcaption.find('li').eq(1).find('.value')).toHaveText('80');
          expect(figcaption.find('li').eq(1).find('.percentage')).toHaveText('(100%)');

          collection.selectItem(null, null);
          expect(figcaption.find('.summary .value')).toHaveText('240');
          expect(figcaption.find('.summary .percentage')).toHaveText('(100%)');
          expect(figcaption.find('.summary .timeperiod')).toHaveText('last 3 weeks');
          expect(figcaption.find('li').eq(0).find('.value')).toHaveText('30');
          expect(figcaption.find('li').eq(0).find('.percentage')).toHaveText('(13%)');
          expect(figcaption.find('li').eq(1).find('.value')).toHaveText('210');
          expect(figcaption.find('li').eq(1).find('.percentage')).toHaveText('(88%)');
        });

        it("displays (no data) for all items when the current selection is null", function () {
          collection.at(0).get('values').at(2).set('_count', null);
          collection.at(1).get('values').at(2).set('_count', null);
          lineLabel.showValues = true;
          lineLabel.showValuesPercentage = true;
          lineLabel.showSummary = true;
          lineLabel.showTimePeriod = true;
          lineLabel.render();

          var figcaption = lineLabel.$el.find('figcaption');

          collection.selectItem(null, 2);
          expect(figcaption.find('.summary .value')).toHaveText('(no data)');
          expect(figcaption.find('.summary .timeperiod')).toHaveText('26 Aug to 1 Sep 2013');
          expect(figcaption.find('li').eq(0).find('.no-data')).toHaveText('(no data)');
          expect(figcaption.find('li').eq(1).find('.no-data')).toHaveText('(no data)');

          collection.selectItem(null, null);
          expect(figcaption.find('.summary .value')).toHaveText('160');
          expect(figcaption.find('.summary .timeperiod')).toHaveText('last 3 weeks');
          expect(figcaption.find('li').eq(0).find('.value')).toHaveText('30');
          expect(figcaption.find('li').eq(1).find('.value')).toHaveText('130');
        });
      });

      describe("onHover", function () {
        beforeEach(function() {
          spyOn(collection, "selectItem");
          lineLabel.render();
        });

        it("selects the closest label", function () {
          lineLabel.onHover({ x: null, y: 54 });
          expect(collection.selectItem).toHaveBeenCalledWith(0);
          lineLabel.onHover({ x: null, y: 56 });
          expect(collection.selectItem).toHaveBeenCalledWith(1);
        });

        it("unselects when the closest label is already selected and the toggle option is used", function () {
          lineLabel.onHover({ x: null, y: 54, toggle: true });
          expect(collection.selectItem).toHaveBeenCalledWith(0);
          collection.selectedIndex = 0;
          lineLabel.onHover({ x: null, y: 54, toggle: true });
          expect(collection.selectItem).toHaveBeenCalledWith(null);
        });
      });

    });

    describe("setLabelPositions", function() {
      var el, wrapper, lineLabel, graph, collection,
          figcaption, labelWrapper, selection, enterSelection;
      beforeEach(function() {
        collection = new Collection([
          {
            id: 'a',
            values: new Collection([
              { _count: 1, alternative: 8 },
              { _count: 4, alternative: 5 },
              { _count: 7, alternative: 2 }
            ])
          },
          {
            id: 'b',
            values: new Collection([
              { _count: 2, alternative: 9 },
              { _count: 5, alternative: 6 },
              { _count: 8, alternative: 3 }
            ])
          }
        ]);

        var yScale = jasmine.createSpy();
        yScale.plan = function (val) {
          return val * val;
        };
        graph = {
          valueAttr: '_count',
          innerWidth: 100,
          innerHeight: 100,
          getYPos: function (groupIndex, modelIndex) {
            return collection.at(groupIndex).get('values').at(modelIndex).get(graph.valueAttr);
          },
          getY0Pos: function (groupIndex, modelIndex) {
            if (groupIndex > 0) {
              return collection.at(groupIndex - 1).get('values').at(modelIndex).get(graph.valueAttr);
            } else {
              return 0;
            }
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
        selection = labelWrapper.selectAll('li').data(collection.models);
        enterSelection = selection.enter().append('li').attr('style', 'display:block;height:20px;position:absolute;');

        spyOn(lineLabel, "calcPositions").andReturn([
          { min: 20 },
          { min: 30 }
        ]);
      });

      afterEach(function() {
        el.remove();
      });

      it("positions labels vertically so they do not collide", function() {
        lineLabel.applyConfig('overlay');
        lineLabel.setLabelPositions(figcaption.selectAll('li'));
        expect(lineLabel.calcPositions).toHaveBeenCalled();
        var startPositions = lineLabel.calcPositions.argsForCall[0][0];
        expect(lineLabel.scales.y).toHaveBeenCalledWith(7);
        expect(startPositions[0]).toEqual({
          ideal: 49, // yScale was applied to '_count' attribute of last element in line 'a'
          size: 20,
          id: 'a'
        });
        expect(lineLabel.scales.y).toHaveBeenCalledWith(8);
        expect(startPositions[1]).toEqual({
          ideal: 64, // yScale was applied to '_count' attribute of last element in line 'b'
          size: 20,
          id: 'b'
        });

        expect($(wrapper.selectAll('li')[0][0]).prop('style').top).toEqual('20px');
        expect($(wrapper.selectAll('li')[0][1]).prop('style').top).toEqual('30px');
      });

      it("uses the last non-null value for positioning in overlay configuration", function() {
        collection.at(0).get('values').last().set('_count', null);
        collection.at(1).get('values').last().set('_count', null);
        lineLabel.applyConfig('overlay');
        lineLabel.setLabelPositions(wrapper.selectAll('li'));
        expect(lineLabel.calcPositions).toHaveBeenCalled();
        var startPositions = lineLabel.calcPositions.argsForCall[0][0];
        expect(lineLabel.scales.y).toHaveBeenCalledWith(4);
        expect(startPositions[0]).toEqual({
          ideal: 16, // yScale was applied to '_count' attribute of penultimate element in line 'a'
          size: 20,
          id: 'a'
        });
        expect(lineLabel.scales.y).toHaveBeenCalledWith(5);
        expect(startPositions[1]).toEqual({
          ideal: 25, // yScale was applied to '_count' attribute of penultimate element in line 'b'
          size: 20,
          id: 'b'
        });
      });

      it("positions labels closest to the centre of the area in stack configuration", function() {
        lineLabel.applyConfig('stack');
        lineLabel.setLabelPositions(wrapper.selectAll('li'));
        expect(lineLabel.calcPositions).toHaveBeenCalled();
        var startPositions = lineLabel.calcPositions.argsForCall[0][0];
        expect(lineLabel.scales.y).toHaveBeenCalledWith(3.5);
        expect(startPositions[0]).toEqual({
          ideal: 12.25, // centre of first area
          size: 20,
          id: 'a'
        });
        expect(lineLabel.scales.y).toHaveBeenCalledWith(7.5);
        expect(startPositions[1]).toEqual({
          ideal: 56.25, // centre of second area
          size: 20,
          id: 'b'
        });

        expect($(wrapper.selectAll('li')[0][0]).prop('style').top).toEqual('20px');
        expect($(wrapper.selectAll('li')[0][1]).prop('style').top).toEqual('30px');
      });

      it("uses the last non-null value for positioning in stack configuration", function() {
        collection.at(0).get('values').last().set('_count', null);
        collection.at(1).get('values').last().set('_count', null);

        lineLabel.applyConfig('stack');
        lineLabel.setLabelPositions(wrapper.selectAll('li'));
        expect(lineLabel.calcPositions).toHaveBeenCalled();
        var startPositions = lineLabel.calcPositions.argsForCall[0][0];
        expect(lineLabel.scales.y).toHaveBeenCalledWith(2);
        expect(startPositions[0]).toEqual({
          ideal: 4, // centre of first area when using penultimate value
          size: 20,
          id: 'a'
        });
        expect(lineLabel.scales.y).toHaveBeenCalledWith(4.5);
        expect(startPositions[1]).toEqual({
          ideal: 20.25, // centre of second area when using penultimate value
          size: 20,
          id: 'b'
        });
      });

    });

    describe("renderLines", function() {
      var el, componentWrapper, lineLabel;
      beforeEach(function() {
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
          { y: 30, yLabel: 40 },
          { y: 80, yLabel: 80 }
        ]);
        lineLabel.positions = [
          { ideal: 30, min: 40 },
          { ideal: 80, min: 80 }
        ];
        componentWrapper.selectAll('g.label').data(collection.models)
          .enter().append('g').attr('class', 'label').append('line');
        lineLabel.componentWrapper = componentWrapper;
      });

      afterEach(function() {
        el.remove();
      });

      it("renders lines to connect last items with labels", function() {
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

      it("displays straight lines with 'crisp' option", function() {
        lineLabel.renderLines();
        var line1 = d3.select(componentWrapper.selectAll('line')[0][0]);
        var line2 = d3.select(componentWrapper.selectAll('line')[0][1]);
        expect(line1.attr('class')).toBeFalsy();
        expect(line2.attr('class')).toEqual('crisp');
      });
    });

    describe("calcPositions", function() {

      var line;
      beforeEach(function() {
        line = new LineLabel({
          interactive: false,
          collection: {
            on: jasmine.createSpy()
          }
        });
      });

      it("places non-adjacent items at their ideal positions when possible", function() {
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

      it("places adjacent items at their ideal positions when possible", function() {
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

      it("places items as close to their ideal positions as possible", function() {
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

      it("places multiple clusters of items as close to their ideal positions as possible", function() {
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

      it("keeps items within minimum bounds", function() {
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

      it("keeps items within minimum bounds", function() {
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

      it("overlaps items as necessary if available space is not sufficient", function () {
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
