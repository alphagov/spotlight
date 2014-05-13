define([
  'extensions/views/graph/stacked-linelabel',
  'extensions/collections/matrix'
],
function (LineLabel, Collection) {

  describe('Stacked Line Label Component', function () {

    describe('setLabelPositions', function () {
      var el, wrapper, lineLabel, graph, collection,
          figcaption, labelWrapper, selection, enterSelection;
      beforeEach(function () {
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

        spyOn(lineLabel, 'calcPositions').andReturn([
          { min: 20 },
          { min: 30 }
        ]);
      });

      afterEach(function () {
        el.remove();
      });

      it('positions labels closest to the centre of the area', function () {
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

      it('uses the last non-null value for positioning', function () {
        collection.at(0).get('values').last().set('_count', null);
        collection.at(1).get('values').last().set('_count', null);

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

  });

});
