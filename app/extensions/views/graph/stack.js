define([
  'require',
  './line',
  'extensions/views/graph/component'
],
function (require, Line, Component) {
  var Stack = Line.extend({

    selectGroup: true,
    allowMissingData: false,

    render: function () {
      Component.prototype.render.apply(this, arguments);

      var layers = this.graph.layers;

      var groupStacks = this.componentWrapper.selectAll('g.stacks').data([0]);
      groupStacks.enter().append('g').attr('class', 'stacks');

      var selectionStacks = groupStacks.selectAll('g.group')
          .data(layers);
      selectionStacks.exit().remove();

      var groupLines = this.componentWrapper.selectAll('g.lines').data([0]);
      groupLines.enter().append('g').attr('class', 'lines');

      var selectionLines = groupLines.selectAll('g.group')
          .data(layers);
      selectionLines.exit().remove();

      this.renderContent(selectionStacks, selectionLines);
    },

    renderContent: function (selectionStacks, selectionLines) {
      var that = this;
      var getX = function (model, index) {
        return that.x.call(that, null, 0, model, index);
      };

      var yProperty = this.graph.stackYProperty || 'y';
      var y0Property = this.graph.stackY0Property || 'y0';

      var yScale = this.scales.y;

      var hasYValue = function(model) {
        return model[yProperty] !== null;
      };

      var getY = function (model, index) {
        return yScale(model[yProperty] + model[y0Property]);
      };

      var getY0 = function (model, index) {
        return yScale(model[y0Property]);
      };

      var area = d3.svg.area()
        .defined(hasYValue)
        .x(getX)
        .y0(getY0)
        .y1(getY);

      var line = d3.svg.line()
        .defined(hasYValue)
        .x(getX)
        .y(getY);

      var graph = this.graph;
      var maxGroupIndex = this.collection.length - 1;

      selectionStacks.enter().append("g").attr('class', 'group').append('path')
          .attr("class", function (group, index) {
            return 'stack stack' + (maxGroupIndex-index) + ' ' + group.get('id');
          });
      selectionStacks.select('path').attr("d", function(group, groupIndex) {
        return area(group.get('values').models);
      });

      selectionLines.enter().append("g").attr('class', 'group').append('path')
          .attr("class", function (group, index) {
            return 'line line' + (maxGroupIndex-index) + ' ' + group.get('id');
          });
      selectionLines.select('path').attr("d", function(group, groupIndex) {
        return line(group.get('values').models);
      });

      // Restore correct order element order. Order gets mixed up on selection
      // change when we bring the 'selected' line to front.
      this.collection.each(function (group, groupIndex) {
        var index = maxGroupIndex - groupIndex;
        var line = selectionLines.select('path.line' + index);
        var groupEl = line.node().parentNode;
        groupEl.parentNode.appendChild(groupEl);
      }, this);
    },

    onChangeSelected: function (groupSelected, groupIndexSelected, modelSelected, indexSelected) {
      Line.prototype.onChangeSelected.apply(this, arguments);
      this.collection.each(function (group, groupIndex) {
        var selected = (groupIndexSelected === groupIndex);
        var stack = this.componentWrapper.select('path.stack' + groupIndex);
        stack.classed('selected', selected);
      }, this);
    },

    /**
     * Selects the group the user is hovering over and the closest item in
     * that group.
     * When position is below the last area, the last area is selected.
     * When position is above the first area, the first area is selected.
     * @param {Object} e Hover event details
     * @param {Number} e.x Hover x position
     * @param {Number} e.y Hover y position
     * @param {Boolean} [e.toggle=false] Unselect if the new selection is the current selection
     */
    onHover: function (e) {
      var point = {
        x: e.x,
        y: e.y
      };

      var selectedGroupIndex, selectedItemIndex;
      for (var i = this.collection.models.length - 1; i >= 0; i--) {
        var group = this.collection.models[i];
        var distanceAndClosestModel = this.getDistanceAndClosestModel(
          group, i, point, { allowMissingData: this.allowMissingData }
        );

        if (distanceAndClosestModel.diff > 0 || i === 0) {
          selectedGroupIndex = i;
          selectedItemIndex = distanceAndClosestModel.index;
          break;
        }
      }

      if (!this.selectGroup) {
        selectedGroupIndex = null;
      }
      if (e.toggle) {
        this.collection.selectItem(selectedGroupIndex, selectedItemIndex, { toggle: true });
      } else {
        this.collection.selectItem(selectedGroupIndex, selectedItemIndex);
      }

    }
  });

  return Stack;
});
