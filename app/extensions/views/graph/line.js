define([
  'extensions/views/graph/component'
],
function (Component) {

  var LineRenderer = function(that, selection, group, groupIndex) {
    var getX = function (model, index) {
      return that.x(group, groupIndex, model, index);
    };
    var getY = function (model, index) {
      return that.y(group, groupIndex, model, index);
    };

    var line = d3.svg.line()
      .x(getX)
      .y(getY)
      .defined(function (model, index) { return getY(model, index) !== null; });

    var renderLine = function() {
      var timeshift = group.get('timeshift') ? ' timeshift' : '';
      selection.select('path')
        .attr('d', line(group.get('values').models))
        .attr('class', 'line line' + groupIndex + ' ' + group.get('id') + timeshift);
    };

    var renderTerminators = function() {
      selection.selectAll(".terminator").remove();
      group.get('values').each(function (model, index) {
        var hasCurrentPoint = (getY(model, index) !== null),
            missingPreviousPoint = (index > 0 && getY(model, index - 1) === null),
            missingNextPoint = (index < group.get('values').size() - 1 && getY(model, index + 1) === null),
            showTerminator = hasCurrentPoint && (missingPreviousPoint || missingNextPoint);

        if (showTerminator) {
          selection.append("circle")
            .attr("class", "terminator line" + groupIndex)
            .attr("cx", getX(model, index))
            .attr("cy", getY(model, index))
            .attr("r", 1.5);
        }
      });
    };

    return {
      render: function() {
        renderLine();
        renderTerminators();
      }
    };
  };

  var Line = Component.extend({

    interactive: true,

    drawCursorLine: false,
    
    x: function (group, groupIndex, model, index) {
      var xPos = this.graph.getXPos(groupIndex, index);
      return xPos === null ? xPos : Math.floor(this.scales.x(xPos)) + 0.5;
    },
    
    y: function (group, groupIndex, model, index) {
      var yPos = this.graph.getYPos(groupIndex, index);
      return yPos === null ? yPos : this.scales.y(yPos);
    },

    /**
     * Renders a line for each group in the collection.
     */
    render: function () {
      Component.prototype.render.apply(this, arguments);
      
      var selection = this.componentWrapper
        .selectAll('g.group')
        .data(this.collection.models);
      selection.enter().append('g').attr('class', 'group').append('path');
      selection.exit().remove();
        
      var that = this;
      var groups = [];
      selection.each(function (group, groupIndex) {
        var groupSelection = d3.select(this);
        groups.push(groupSelection);
        LineRenderer(that, groupSelection, group, groupIndex).render();
      });

      for (var i = groups.length - 1; i >= 0; i--){
        this.moveToFront(groups[i]);
      }

      var currentSelection = this.collection.getCurrentSelection();
      this.onChangeSelected(
        currentSelection.selectedGroup,
        currentSelection.selectedGroupIndex,
        currentSelection.selectedModel,
        currentSelection.selectedModelIndex
      );
    },

    siblingLineIndex: function(originalIndex){
      return parseInt(originalIndex, 10) + 1;
    },
    resetSiblingLine: function() {
      this.componentWrapper.selectAll('path.line').classed('selected-following-sibling', false).style('stroke', null);
    },
    colourSiblingLine: function(line_colour, originalIndex) {
      var following_sibling_line = this.componentWrapper.select('path.line' + this.siblingLineIndex(originalIndex))
        .classed('selected-following-sibling', true)
        .style('stroke', line_colour);
    },
    renderSiblingCircle: function(y2, x2, originalIndex) {
      this.renderSelectionPoint(originalIndex, x2, y2);
    },
    renderOverlayCursorLine: function(y, x, y2, x2, line_colour) {
      if(y!==y2){
        this.componentWrapper.append('line').attr({
            'class': 'selectedIndicator cursorLine overlay',
            x1: x,
            y1: y,
            x2: x2,
            y2: y2
          })
          .style('stroke', line_colour);
      }
    },

    onChangeSelected: function (groupSelected, groupIndexSelected, modelSelected, indexSelected) {
      this.componentWrapper.selectAll('path.line').classed('selected', false);
      if(this.encompassStack){
        this.resetSiblingLine();
      }
      this.componentWrapper.selectAll('path.line').classed('not-selected', Boolean(groupSelected));
      this.componentWrapper.selectAll('circle.terminator').classed('selected', false);
      this.componentWrapper.selectAll('circle.terminator').classed('not-selected', Boolean(groupSelected));

      var line_colour, x2, y2;

      if (groupSelected) {
        var line = this.componentWrapper.select('path.line' + groupIndexSelected)
          .classed('selected', true)
          .classed('not-selected', false);
        if(this.encompassStack){
          line_colour = line.style('stroke');
          this.colourSiblingLine(line_colour, groupIndexSelected);
        }
        this.componentWrapper.selectAll('circle.terminator.line' + groupIndexSelected)
          .classed('selected', true)
          .classed('not-selected', false);
        var group = line.node().parentNode;
        group.parentNode.appendChild(group);
      }

      this.componentWrapper.selectAll('.selectedIndicator').remove();
      if (modelSelected) {
        var x = this.x(groupSelected, groupIndexSelected, modelSelected, indexSelected);
        if (this.drawCursorLine) {
          this.renderCursorLine(x);
        }
        if (groupSelected) {
          var y = this.y(groupSelected, groupIndexSelected, modelSelected, indexSelected);
          if(this.encompassStack){
            x2 = this.x(groupSelected, this.siblingLineIndex(groupIndexSelected), modelSelected, indexSelected);
            y2 = this.y(groupSelected, this.siblingLineIndex(groupIndexSelected), modelSelected, indexSelected);
            if(this.drawCursorLine){
              this.renderOverlayCursorLine(y, x, y2, x2, line_colour);
            }
          }
          if (y !== null) {
            if(this.encompassStack){
              this.renderSiblingCircle(y2, x2, groupIndexSelected);
            }
            this.renderSelectionPoint(groupIndexSelected, x, y);
          }
        }
      }
    },

    renderSelectionPoint: function (groupIndexSelected, x, y) {
      this.componentWrapper.append('circle').attr({
        'class': 'selectedIndicator line' + groupIndexSelected,
        cx: x,
        cy: y,
        r: 4
      });
    },

    renderCursorLine: function (x) {
      this.componentWrapper.append('line').attr({
        'class': 'selectedIndicator cursorLine',
        x1: x,
        y1: 0,
        x2: x,
        y2: this.graph.innerHeight
      });
      this.componentWrapper.append('line').attr({
        'class': 'selectedIndicator cursorLine ascender',
        x1: x,
        y1: -this.margin.top,
        x2: x,
        y2: 0
      });
      this.componentWrapper.append('line').attr({
        'class': 'selectedIndicator cursorLine descender',
        x1: x,
        y1: this.graph.innerHeight,
        x2: x,
        y2: this.graph.innerHeight + this.margin.bottom
      });
    },

    /**
     * Calculates the `distance` of a group to a given point, then picks the
     * closest point in the group.
     * @param {Object} group Data series collection
     * @param {Number} groupIndex Index of data series
     * @param {Object} point Coordinates to calculate distance from
     * @param {Number} point.x x-coordinate
     * @param {Number} point.y y-coordinate
     * @param {Object} [options={}] Options
     * @param {Boolean} [options.allowMissingData=false] Accept data points with null value
     */
    getDistanceAndClosestModel: function (group, groupIndex, point, options) {
      options = _.extend({
        allowMissingData: false
      }, options);

      var values = group.get('values');
      
      // find indices right and left of point
      var leftIndexStart = values.length -1;
      var rightIndexStart = 0;
      for (var i = 0; i < values.length; i++) {
        if (this.x(group, groupIndex, values.at(i), i) >= point.x) {
          rightIndexStart = i;
          leftIndexStart = i - 1;
          break;
        }
      }

      // search for valid models. when not allowing nulls, search for models
      // with non-null values
      var leftIndex, rightIndex;
      for (i = leftIndexStart; i >= 0; i--) {
        if (options.allowMissingData || this.y(group, groupIndex, values.at(i), i) !== null) {
          leftIndex = i;
          break;
        }
      }
      for (i = rightIndexStart; i < values.length; i++) {
        if (options.allowMissingData || this.y(group, groupIndex, values.at(i), i) !== null) {
          rightIndex = i;
          break;
        }
      }

      var left = values.at(leftIndex);
      var right = values.at(rightIndex);
      if (!left && !right) {
        return;
      } else if (!left) {
        left = right;
        leftIndex = rightIndex;
      } else if (!right) {
        right = left;
        rightIndex = leftIndex;
      }

      var distLeft = Math.abs(point.x - this.x(group, groupIndex, left, leftIndex));
      var distRight = Math.abs(this.x(group, groupIndex, right, rightIndex) - point.x);

      var diff, dist;
      if ( leftIndex + 1 < values.length ){
        var weight = distLeft / (distLeft + distRight) || 0;
        var leftY = this.y(group, groupIndex, left, leftIndex);
        var rightY;
        for (i = rightIndex; i < group.get('values').models.length; i++) {
          rightY = this.y(group, groupIndex, right, i);
          if(rightY){
            break;
          }
        }
        var y = this.d3.interpolate(leftY, rightY)(weight);
        diff = point.y - y;
        dist = Math.abs(diff);
      }else{
        //because NaN < 1 == false but null < 1 == true
        //and I don't want to get into refactoring line and its use of this method
        diff = NaN;
        dist = NaN;
      }

      var bestIndex = distLeft < distRight ? leftIndex : rightIndex;

      return {
        dist: dist,
        diff: diff,
        index: bestIndex
      };
    },
    
    /**
     * Selects an item for a given position.
     * For each group, the algorithm interpolates between points to find the
     * distance of the line to the current position and then picks the closest
     * point of the closest group.
     * There is a bias against changing group to make it easier for users to
     * follow a specific group.
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
      
      var bestDist = Infinity,
          bestModelIndex,
          bestGroupIndex,
          selectedDist,
          selectedIndex = this.collection.selectedIndex;
      
      // Find closest point of closest group
      this.collection.each(function (group, groupIndex) {
        var result = this.getDistanceAndClosestModel(group, groupIndex, point);
        if (result.dist < bestDist) {
          // found new best solution
          bestDist = result.dist;
          bestGroupIndex = groupIndex;
          bestModelIndex = result.index;
        }
        if (groupIndex === selectedIndex) {
          selectedDist = result.dist;
          selectedModelIndex = result.index;
        }
      }, this);
      
      // Selection bias - only switch between groups when new group is
      // significantly closer than currently selected group.
      var biasThreshold = 15;
      var selectArgs = [];
      if (selectedIndex != null && bestGroupIndex !== selectedIndex &&
          selectedDist < biasThreshold) {
        selectArgs.push(selectedIndex, selectedModelIndex);
      } else {
        selectArgs.push(bestGroupIndex, bestModelIndex);
      }
      if (e.toggle) {
        selectArgs.push({ toggle: true });
      }
      this.collection.selectItem.apply(this.collection, selectArgs);
    }
  });

  return Line;
});
