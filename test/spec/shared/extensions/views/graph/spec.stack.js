define([
  'extensions/views/graph/stack',
  'extensions/collections/matrix'
],
function (Stack, Collection) {
  describe("Stack component", function () {
    var el, wrapper, collection, layers, stack;
    beforeEach(function() {
      el = $('<div></div>').appendTo($('body'));
      wrapper = Stack.prototype.d3.select(el[0]).append('svg').append('g');
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
            { a: 1, b: 3},
            { a: 4, b: 6},
            { a: 7, b: 9},
            { a: 10, b: 11},
            { a: 12, b: 13}
          ])
        }
      ]);


      stack = Stack.prototype.d3.layout.stack()
        .values(function (group) {
          return group.get('values').models;
        })
        .y(function (model, index) {
          var y = model.get('b');
          if (y !== null) {
            y += index;
          }
          return y;
        });
      layers = stack(collection.models.slice().reverse());
    });
    
    afterEach(function() {
      el.remove();
    });
    
    describe("render", function() {

      var view;
      beforeEach(function() {
        view = new Stack({
          interactive: false,
          wrapper: wrapper,
          collection: collection,
          scales: {
            x: function (x) {
              return x;
            },
            y: function (x) {
              return x * 2;
            }
          },
          graph: {
            layers: layers,
            getXPos: function (groupIndex, modelIndex) {
              var model = collection.at(groupIndex, modelIndex);
              return model.get('a') + modelIndex;
            }
          }
        });
      });
      
      it("renders a stack consisting of a stroked path and a filled path for each item in the collection", function() {
        view.render();
        var group1 = wrapper.selectAll('g.group:nth-child(1)');
        expect(group1.selectAll('path.line').attr('d')).toEqual('M1.5,6L5.5,14L9.5,22L12.5,28L15.5,34');
        expect(group1.selectAll('path.stack').attr('d')).toEqual('M1.5,6L5.5,14L9.5,22L12.5,28L15.5,34L15.5,0L12.5,0L9.5,0L5.5,0L1.5,0Z');
        var group2 = wrapper.selectAll('g.group:nth-child(2)');
        expect(group2.selectAll('path.line').attr('d')).toEqual('M1.5,10L5.5,26L9.5,42L12.5,54L15.5,66');
        expect(group2.selectAll('path.stack').attr('d')).toEqual('M1.5,10L5.5,26L9.5,42L12.5,54L15.5,66L15.5,34L12.5,28L9.5,22L5.5,14L1.5,6Z');
      });

      it("renders multiple paths when there are gaps in the data", function() {
        collection.at(0).get('values').at(2).set('b', null);
        collection.at(1).get('values').at(2).set('b', null);
        view.graph.layers = stack(collection.models.slice().reverse());
        view.render();
        var group1 = wrapper.selectAll('g.group:nth-child(1)');
        expect(group1.selectAll('path.line').attr('d')).toEqual('M1.5,6L5.5,14M12.5,28L15.5,34');
        expect(group1.selectAll('path.stack').attr('d')).toEqual('M1.5,6L5.5,14L5.5,0L1.5,0ZM12.5,28L15.5,34L15.5,0L12.5,0Z');
        var group2 = wrapper.selectAll('g.group:nth-child(2)');
        expect(group2.selectAll('path.line').attr('d')).toEqual('M1.5,10L5.5,26M12.5,54L15.5,66');
        expect(group2.selectAll('path.stack').attr('d')).toEqual('M1.5,10L5.5,26L5.5,14L1.5,6ZM12.5,54L15.5,66L15.5,34L12.5,28Z');
      });

      it("renders multiple paths when there are gaps in the data and when using custom stack properties", function() {
        collection.at(0).get('values').at(2).set('b', null);
        collection.at(1).get('values').at(2).set('b', null);
        view.graph.stackYProperty = 'yCustom';
        view.graph.stackY0Property = 'yCustom0';
        stack.out(function (model, y0, y) {
          delete model.y0;
          delete model.y;
          model.yCustom0 = y0;
          model.yCustom = y;
        });
        view.graph.layers = stack(collection.models.slice().reverse());
        view.render();
        var group1 = wrapper.selectAll('g.group:nth-child(1)');
        expect(group1.selectAll('path.line').attr('d')).toEqual('M1.5,6L5.5,14M12.5,28L15.5,34');
        expect(group1.selectAll('path.stack').attr('d')).toEqual('M1.5,6L5.5,14L5.5,0L1.5,0ZM12.5,28L15.5,34L15.5,0L12.5,0Z');
        var group2 = wrapper.selectAll('g.group:nth-child(2)');
        expect(group2.selectAll('path.line').attr('d')).toEqual('M1.5,10L5.5,26M12.5,54L15.5,66');
        expect(group2.selectAll('path.stack').attr('d')).toEqual('M1.5,10L5.5,26L5.5,14L1.5,6ZM12.5,54L15.5,66L15.5,34L12.5,28Z');
      });

      it("ensures that elements are rendered in correct order after an element was selected", function () {
        // correct rendering order for stack is from bottom to top
        view.render();
        expect(wrapper.select('g.group:nth-child(1) path.line').attr('class')).toContain('line1');
        expect(wrapper.select('g.group:nth-child(2) path.line').attr('class')).toContain('line0');

        // selecting a group brings the line to front
        view.onChangeSelected(collection.at(1), 1, null, null);
        expect(wrapper.select('g.group:nth-child(1) path.line').attr('class')).toContain('line0');
        expect(wrapper.select('g.group:nth-child(2) path.line').attr('class')).toContain('line1');

        // on re-render, the correct order should be restored
        view.render();
        expect(wrapper.select('g.group:nth-child(1) path.line').attr('class')).toContain('line1');
        expect(wrapper.select('g.group:nth-child(2) path.line').attr('class')).toContain('line0');
      });

    });

    describe("onHover", function () {

      var collection;
      var view;
      var layers;
      var stack;
      beforeEach(function() {
        collection = new Collection([
          {
            // group 0
            values: new Collection([
              { x: 1, y: 2},
              { x: 2, y: 4},
              { x: 3, y: 6},
              { x: 4, y: 8},
              { x: 5, y: 10}
            ])
          },
          {
            // group 1
            values: new Collection([
              { x: 1, y: 3},
              { x: 2, y: 5},
              { x: 3, y: 7},
              { x: 4, y: 9},
              { x: 5, y: 11}
            ])
          }
        ]);


        stack = Stack.prototype.d3.layout.stack()
          .values(function (group) {
            return group.get('values').models;
          })
          .y(function (model, index) {
            return model.get('y');
          });
        layers = stack(collection.models.slice().reverse());

        view = new Stack({
          interactive: false,
          wrapper: wrapper,
          collection: collection,
          graph: {
            layers: layers
          },
          scales: {
            y: function (y) {
              return y;
            }
          },
          x: function (group, groupIndex, model, index) {
            return model.get('x');
          },
          y: function (group, groupIndex, model, index) {
            return model.get('y');
          },
          y0: function (group, groupIndex, model, index) {
            return model.y0;
          }
        });
        view.render();

        spyOn(collection, "selectItem");
      });

      it("selects the group the user is hovering over and the closest model in that group", function () {
        view.onHover({ x: 1, y: 2 });
        expect(collection.selectItem.mostRecentCall.args).toEqual([0, 0]);
        view.onHover({ x: 1, y: 4 });
        expect(collection.selectItem.mostRecentCall.args).toEqual([1, 0]);
      });

      it("selects the first group and the closest model in that group when the user hovers above the topmost area", function () {
        view.onHover({ x: 1, y: -200 });
        expect(collection.selectItem).toHaveBeenCalledWith(0, 0);
      });

      it("selects the last group and the closest model in that group when the user hovers below the bottommost area", function () {
        view.onHover({ x: 1, y: 200 });
        expect(collection.selectItem).toHaveBeenCalledWith(1, 0);
      });

      it("optionally toggles selection when the new item is the currently selected item", function () {
        view.collection.selectItem(1, 0);
        view.onHover({ x: 1, y: 200, toggle: true });
        expect(collection.getCurrentSelection().selectedGroup).toBeFalsy();
        expect(collection.getCurrentSelection().selectedModel).toBeFalsy();
      });

      it("optionally selects all items at a given position but not the group", function () {
        view.selectGroup = false;
        view.onHover({ x: 1, y: 3 });
        expect(collection.selectItem.mostRecentCall.args).toEqual([null, 0]);
      });

      it("selects closest point when hovering over missing data and missing data is not allowed", function() {
        var missingDataIndex = 2;

        collection.at(0).get('values').at(missingDataIndex).set('y', null);
        collection.at(1).get('values').at(missingDataIndex).set('y', null);

        view.onHover({ x: 3.1, y: missingDataIndex });
        expect(collection.selectItem.mostRecentCall.args).toEqual([0, 3]);
      });

      it("selects missing data index when missing data is allowed", function() {
        var missingDataIndex = 2;

        collection.at(0).get('values').at(missingDataIndex).set('y', null);
        collection.at(1).get('values').at(missingDataIndex).set('y', null);

        view.allowMissingData = true;
        view.onHover({ x: 3.1, y: missingDataIndex });
        expect(collection.selectItem.mostRecentCall.args[1]).toEqual(missingDataIndex);
      });
    });
  });
});
