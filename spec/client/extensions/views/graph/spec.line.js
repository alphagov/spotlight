define([
  'extensions/views/graph/line',
  'extensions/collections/collection'
],
function (Line, Collection) {
  
  describe('Line Component', function () {
    var el, wrapper, collection, view, lineColour0, lineColour1, lineColour0RGB, lineColour1RGB;

    var matchesColour = function (str, line) {
      if (line === 0) {
        return (str === lineColour0) || (str === lineColour0RGB);
      } else if (line === 1) {
        return (str === lineColour1) || (str === lineColour1RGB);
      }
      return false;
    };

    beforeEach(function () {
      lineColour0 = '#097f96';
      lineColour1 = '#d14836';
      lineColour0RGB = 'rgb(9, 127, 150)';
      lineColour1RGB = 'rgb(209, 72, 54)';
      el = $('<div><style type="text/css">.line0 {stroke: ' + lineColour0 + ';}.line1 {stroke: ' + lineColour1 + ';}</style></div>').appendTo($('body'));
      wrapper = Line.prototype.d3.select(el[0]).append('svg').append('g');
      collection = new Collection([
        {
          testAttr: 'b',
          values: new Collection([
            { a: 1, b: 2},
            { a: 4, b: 5},
            { a: 7, b: 8},
            { a: 9, b: 10},
            { a: 11, b: 12}
          ])
        },
        {
          testAttr: 'c',
          values: new Collection([
            { a: 1, b: 3, c: 3},
            { a: 4, b: 6, c: 6},
            { a: 7, b: 9, c: 9},
            { a: 10, b: 11, c: 11},
            { a: 12, b: 13, c: 13}
          ])
        }
      ]);
      collection.getCurrentSelection = jasmine.createSpy().andReturn({
        selectedGroup: collection.at(0),
        selectedGroupIndex: 0,
        selectedModel: { a: 1 },
        selectedModelIndex: 2
      });

      view = new Line({
        interactive: false,
        wrapper: wrapper,
        collection: collection,
        x: function (group, groupIndex, model, index) {
          return group.get('values').at(index).get('a');
        },
        y: function (group, groupIndex, model, index) {
          var attr = group.get('testAttr');
          return group.get('values').at(index).get(attr);
        }
      });
      spyOn(Line.prototype, 'onChangeSelected');
    });

    afterEach(function () {
      el.remove();
    });

    describe('render', function () {

      it('requires an "x" definition', function () {
        expect(function () {
          var view = new Line({
            wrapper: wrapper,
            y: function () {}
          });
          view.render();
        }).toThrow();
      });

      it('requires an "y" definition', function () {
        expect(function () {
          var view = new Line({
            wrapper: wrapper,
            x: function () {}
          });
          view.render();
        }).toThrow();
      });

      it('renders paths for each group in the collection in reverse order with sections for each point in the timeseries', function () {
        view.render();

        expect(wrapper.select('g.group:nth-child(1) path').attr('d')).toEqual('M1,3L4,6L7,9L10,11L12,13');
        expect(wrapper.select('g.group:nth-child(2) path').attr('d')).toEqual('M1,2L4,5L7,8L9,10L11,12');
      });

      it('renders multiple paths when there are gaps in the data', function () {
        collection.at(0).get('values').at(2).set('b', null);
        view.render();

        expect(wrapper.select('g.group:nth-child(2) path').attr('d')).toEqual('M1,2L4,5M9,10L11,12');
      });

      it('highlights the current selection', function () {
        view.render();

        expect(view.onChangeSelected).toHaveBeenCalledWith(
          collection.at(0), 0, { a: 1 }, 2
        );
      });
    });

    describe('onChangeSelected', function () {

      var hasClass = function (selector, className) {
        var selection = view.componentWrapper.selectAll(selector);
        var eachItemHasClass = true;
        selection.each(function () {
          if (!eachItemHasClass) {
            return;
          }
          var itemHasClass = _.contains(
            d3.select(this).attr('class').split(' '),
            className
          );
          if (!itemHasClass) {
            eachItemHasClass = false;
          }
        });
        return eachItemHasClass;
      };

      describe('when encompassStack is true', function () {
        it('highlights the selected group and the following line, dims the other groups and sets the following line colour to that of the selected', function () {
          view.encompassStack = true;
          view.render();
          view.onChangeSelected.originalValue.call(view, collection.at(1), 1, null, null);
          expect(hasClass('path.line0', 'selected')).toBe(false);
          expect(hasClass('path.line1', 'selected')).toBe(true);
          expect(hasClass('path.line0', 'not-selected')).toBe(true);
          expect(hasClass('path.line1', 'not-selected')).toBe(false);
          expect(view.componentWrapper.selectAll('.selectedIndicator')[0].length).toEqual(0);
          //as this is the last line there is no further line to colour to encompass the stack
          expect(hasClass('path.line0', 'selected-following-sibling')).toBe(false);
          expect(hasClass('path.line1', 'selected-following-sibling')).toBe(false);
          expect(matchesColour(view.componentWrapper.select('path.line0').style('stroke'), 0)).toBeTruthy;
          expect(matchesColour(view.componentWrapper.select('path.line1').style('stroke'), 1)).toBeTruthy;

          view.onChangeSelected.originalValue.call(view, collection.at(0), 0, null, null);

          expect(hasClass('path.line0', 'selected')).toBe(true);
          expect(hasClass('path.line1', 'selected')).toBe(false);
          expect(hasClass('path.line0', 'not-selected')).toBe(false);
          expect(hasClass('path.line1', 'not-selected')).toBe(true);
          expect(hasClass('path.line0', 'selected-following-sibling')).toBe(false);
          expect(hasClass('path.line1', 'selected-following-sibling')).toBe(true);
          expect(matchesColour(view.componentWrapper.select('path.line0').style('stroke'), 0)).toBeTruthy;
          expect(matchesColour(view.componentWrapper.select('path.line1').style('stroke'), 0)).toBeTruthy;
        });
      });
      describe('when encompassStack is not set', function () {
        it('highlights the selected group and dims the other groups', function () {
          view.render();
          view.onChangeSelected.originalValue.call(view, collection.at(1), 1, null, null);
          expect(hasClass('path.line0', 'selected')).toBe(false);
          expect(hasClass('path.line1', 'selected')).toBe(true);
          expect(hasClass('path.line0', 'not-selected')).toBe(true);
          expect(hasClass('path.line1', 'not-selected')).toBe(false);
          expect(hasClass('path.line0', 'selected-following-sibling')).toBe(false);
          expect(hasClass('path.line1', 'selected-following-sibling')).toBe(false);
          expect(matchesColour(view.componentWrapper.select('path.line0').style('stroke'), 0)).toBeTruthy;
          expect(matchesColour(view.componentWrapper.select('path.line1').style('stroke'), 1)).toBeTruthy;
          expect(view.componentWrapper.selectAll('.selectedIndicator')[0].length).toEqual(0);

          view.onChangeSelected.originalValue.call(view, collection.at(0), 0, null, null);

          expect(hasClass('path.line0', 'selected')).toBe(true);
          expect(hasClass('path.line1', 'selected')).toBe(false);
          expect(hasClass('path.line0', 'not-selected')).toBe(false);
          expect(hasClass('path.line1', 'not-selected')).toBe(true);
          expect(hasClass('path.line0', 'selected-following-sibling')).toBe(false);
          expect(hasClass('path.line1', 'selected-following-sibling')).toBe(false);
          expect(matchesColour(view.componentWrapper.select('path.line0').style('stroke'), 0)).toBeTruthy;
          expect(matchesColour(view.componentWrapper.select('path.line1').style('stroke'), 1)).toBeTruthy;
        });
      });

      it('highlights the selected group and dims the other groups and their line terminators', function () {
        collection.at(0).get('values').at(3).set('b', null);
        collection.at(1).get('values').at(3).set('c', null);

        view.encompassStack = true;
        view.render();
        view.onChangeSelected.originalValue.call(view, collection.at(1), 1, null, null);
        expect(hasClass('path.line0', 'selected')).toBe(false);
        expect(hasClass('path.line1', 'selected')).toBe(true);
        expect(hasClass('path.line0', 'not-selected')).toBe(true);
        expect(hasClass('path.line1', 'not-selected')).toBe(false);
        expect(hasClass('circle.terminator.line0', 'selected')).toBe(false);
        expect(hasClass('circle.terminator.line1', 'selected')).toBe(true);
        expect(hasClass('circle.terminator.line0', 'not-selected')).toBe(true);
        expect(hasClass('circle.terminator.line1', 'not-selected')).toBe(false);
        expect(view.componentWrapper.selectAll('.selectedIndicator')[0].length).toEqual(0);

        view.onChangeSelected.originalValue.call(view, collection.at(0), 0, null, null);

        expect(hasClass('path.line0', 'selected')).toBe(true);
        expect(hasClass('path.line1', 'selected')).toBe(false);
        expect(hasClass('path.line0', 'not-selected')).toBe(false);
        expect(hasClass('path.line1', 'not-selected')).toBe(true);
        expect(hasClass('circle.terminator.line0', 'selected')).toBe(true);
        expect(hasClass('circle.terminator.line1', 'selected')).toBe(false);
        expect(hasClass('circle.terminator.line0', 'not-selected')).toBe(false);
        expect(hasClass('circle.terminator.line1', 'not-selected')).toBe(true);
      });

      describe('when encompassStack is true', function () {
        beforeEach(function () {
          var y = function (group, groupIndex) {
            return groupIndex * 100;
          };
          var x = function (group, groupIndex) {
            return groupIndex * 50;
          };
          view.y = y;
          view.x = x;
          view.encompassStack = true;
          view.drawCursorLine = true;
          view.renderCursorLine = function () { return null; };
        });
        it('renders a selection indicator on the selected item and the one after using the class of the first and joins them by line', function () {
          view.render();
          view.onChangeSelected.originalValue.call(view, collection.at(1), 1, collection.at(1).get('values').at(1), 1);

          expect(view.componentWrapper.select('path.line1').attr('class').indexOf('selected')).not.toBe(-1);
          var circles = view.componentWrapper.selectAll('circle.selectedIndicator')[0];
          expect(circles.length).toEqual(2);
          expect($(circles[0]).attr('cx')).toEqual('100');
          expect($(circles[0]).attr('cy')).toEqual('200');
          expect($(circles[1]).attr('cx')).toEqual('50');
          expect($(circles[1]).attr('cy')).toEqual('100');
          expect($(circles[0]).attr('class')).toEqual($(circles[1]).attr('class'));

          var overlayCursorLine = view.componentWrapper.select('line.selectedIndicator.cursorLine.overlay');
          expect(overlayCursorLine.attr('x1')).toEqual('50');
          expect(overlayCursorLine.attr('y1')).toEqual('100');
          expect(overlayCursorLine.attr('x2')).toEqual('100');
          expect(overlayCursorLine.attr('y2')).toEqual('200');
          expect(matchesColour(overlayCursorLine.style('stroke'), 1)).toBeTruthy;
        });
      });
      describe('when encompassStack is true', function () {
        it('renders a selection indicator on the selected item and not the one after', function () {
          var y = function (group, groupIndex) {
            return groupIndex * 100;
          };
          var x = function (group, groupIndex) {
            return groupIndex * 50;
          };
          view.y = y;
          view.x = x;
          view.render();
          view.onChangeSelected.originalValue.call(view, collection.at(1), 1, collection.at(1).get('values').at(1), 1);

          expect(view.componentWrapper.select('path.line1').attr('class').indexOf('selected')).not.toBe(-1);
          var circles = view.componentWrapper.selectAll('circle.selectedIndicator')[0];
          expect(circles.length).toEqual(1);
          expect($(circles[0]).attr('cx')).toEqual('50');
          expect($(circles[0]).attr('cy')).toEqual('100');
        });
      });

      it('doesn\'t renders a selection indicator for missing data item', function () {
        view.render();
        collection.at(1).get('values').at(1).set('c', null);
        view.onChangeSelected.originalValue.call(view, collection.at(1), 1, collection.at(1).get('values').at(1), 1);

        expect(view.componentWrapper.selectAll('circle.selectedIndicator')[0].length).toEqual(0);
      });
    });

    describe('getDistanceAndClosestModel', function () {

      it('calculates distance to an interpolated position between points and picks closest model', function () {
        var res = view.getDistanceAndClosestModel(collection.at(0), 0, {
          x: 2.5,
          y: -3
        }, {
          allowMissingData: true
        });
        expect(res.dist).toEqual(6.5);
        expect(res.diff).toEqual(-6.5);
        expect(res.index).toEqual(1);

        res = view.getDistanceAndClosestModel(collection.at(0), 0, {
          x: 7,
          y: 8
        }, {
          allowMissingData: true
        });
        expect(res.dist).toEqual(0);
        expect(res.diff).toEqual(0);
        expect(res.index).toEqual(2);
      });

      it('calculates NaN distance to a line when the x is off the scale', function () {
        var res = view.getDistanceAndClosestModel(collection.at(0), 0, {
          x: 50,
          y: -3
        }, {
          allowMissingData: true
        });
        expect(isNaN(res.dist)).toEqual(true);
        expect(isNaN(res.diff)).toEqual(true);
        expect(res.index).toEqual(4);
      });

      it('calculates distance to an interpolated position between points and picks closest model that is not null', function () {
        collection.at(0).get('values').at(1).set('b', null);
        var res = view.getDistanceAndClosestModel(collection.at(0), 0, {
          x: 2.5,
          y: 2
        });
        expect(res.dist).toEqual(1.5);
        expect(res.diff).toEqual(-1.5);
        expect(res.index).toEqual(0);

        res = view.getDistanceAndClosestModel(collection.at(0), 0, {
          x: 7,
          y: 8
        });
        expect(res.dist).toEqual(0);
        expect(res.diff).toEqual(0);
        expect(res.index).toEqual(2);
      });


      it('selected the first point when no other points have a value', function () {
        collection.at(0).get('values').at(1).set('b', null);
        collection.at(0).get('values').at(2).set('b', null);
        collection.at(0).get('values').at(3).set('b', null);
        collection.at(0).get('values').at(4).set('b', null);
        var res = view.getDistanceAndClosestModel(collection.at(0), 0, {
          x: 7,
          y: 2
        });
        expect(res.dist).toEqual(0);
        expect(res.diff).toEqual(0);
        expect(res.index).toEqual(0);
      });

      it('selected the null point when there is a gap in the data and allowMissingData is true', function () {
        collection.at(0).get('values').at(2).set('b', null);
        var res = view.getDistanceAndClosestModel(collection.at(0), 0, {
          x: 5.49,
          y: 2
        }, {allowMissingData: true});
        expect(res.index).toEqual(1);
        expect(isNaN(res.diff)).toEqual(false);
        res = view.getDistanceAndClosestModel(collection.at(0), 0, {
          x: 5.5,
          y: 2
        }, {allowMissingData: true});
        expect(res.index).toEqual(2);
        expect(isNaN(res.diff)).toEqual(false);
        res = view.getDistanceAndClosestModel(collection.at(0), 0, {
          x: 7.99,
          y: 2
        }, {allowMissingData: true});
        expect(res.index).toEqual(2);
        expect(isNaN(res.diff)).toEqual(false);
        res = view.getDistanceAndClosestModel(collection.at(0), 0, {
          x: 8,
          y: 2
        }, {allowMissingData: true});
        expect(res.index).toEqual(3);
        expect(isNaN(res.diff)).toEqual(false);
      });

    });

    describe('onHover', function () {

      beforeEach(function () {
        spyOn(collection, 'selectItem');
      });

      it('selects the closest item in the closest group', function () {
        view.onHover({
          x: 7,
          y: 8
        });
        expect(collection.selectItem).toHaveBeenCalledWith(0, 2);
      });

      it('keeps the current group when possible', function () {
        view.collection.selectedIndex = 1;
        view.onHover({
          x: 7,
          y: 8
        });
        expect(collection.selectItem).toHaveBeenCalledWith(1, 2);
      });

      it('optionally toggles selection when the new item is the currently selected item', function () {
        view.collection.selectedIndex = 0;
        view.collection.selectedItem = view.collection.at(0);
        view.collection.at(0).get('values').selectItem(2);
        view.onHover({ x: 7, y: 8, toggle: true });
        expect(collection.selectItem.mostRecentCall.args).toEqual([0, 2, { toggle : true }]);
      });
    });
  });
  
});
