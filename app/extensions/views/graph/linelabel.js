define([
  'extensions/views/graph/component'
],
function (Component) {

  var LineLabel = Component.extend({

    offset: 20,
    linePaddingInner: 4,
    linePaddingOuter: 4,
    overlapLabelTop: 40,
    overlapLabelBottom: 20,
    labelOffset: 6,

    showSquare: true,
    showValues: false,
    showValuesPercentage: false,
    showSummary: false,
    showTimePeriod: false,
    attachLinks: false,
    summaryPadding: -36,

    classed: 'labels',

    interactive: function (e) {
      if (this.graph.lineLabelOnTop()) {
        return false;
      } else {
        return e.slice % 3 === 2;
      }
    },

    /**
     * Renders labels for current collection.
     */
    render: function () {
      Component.prototype.render.apply(this, arguments);

      var left = this.graph.innerWidth + this.offset;
      this.componentWrapper
        .classed(this.classed, true)
        .attr('transform', 'translate(' + left + ', 0)');

      var wrapper = this.d3.select(this.$el[0]);
      this.figcaption = wrapper.selectAll('figcaption').data(['one-figcaption']);
      this.figcaption.enter().insert('figcaption', '.graph-wrapper').attr('class', 'legend');

      // Hide elements from assistive technology to improve their experience
      this.figcaption.attr('role', 'presentation');
      this.figcaption.attr('aria-hidden', 'true');

      this.renderSummary();
      this.renderLabels();
      this.renderLines();

      if (!this.rendered) {
        // On first render, height of multi-line labels is sometimes reported
        // incorrectly. Work around by triggering re-render once.
        this.rendered = true;
        setTimeout(_.bind(function () {
          this.render();
        }, this), 0);
      }
    },

    /**
     * Links are displayed above hover element and intercept events.
     * Replicates hover functionality for link areas.
     */
    events: function () {
      var eventName = this.modernizr.touch ? 'touchstart' : 'mousemove';
      var events = {};
      events[eventName + ' li'] = function (e) {
        var target = $(e.currentTarget);
        var index = $(this.figcaption.node()).find('li').index(target);
        this.collection.selectItem(index);

        if (!this.bodyListener) {
          this.bodyListener = true;
          var that = this;
          $('body').one(eventName, function () {
            that.bodyListener = false;
            that.collection.selectItem(null, null);
          });
        }

        return false;
      };

      return events;
    },

    renderValuePercentage: function (value, percentage) {
      var data = [],
          summary = '';

      if (value === null && !percentage) {
        return '<span class="no-data">(no data)</span>';
      }

      if (value !== null) {
        data.push(this.format(value, { type: 'number', magnitude: true, pad: true }));
      }
      if (percentage) {
        if (this.graph.model && this.graph.model.get('one-hundred-percent')) {
          data.unshift(this.format(percentage, 'percent'));
        } else {
          data.push(this.format(percentage, 'percent'));
        }
      }
      summary = '<span class="value">' + data.shift() + '</span>';
      summary += (data.length ? ' <span class="percentage">(' + data.shift() + ')</span>' : '');
      return summary;
    },

    renderSummary: function () {

      this.summaryHeight = 0;

      if (!this.showSummary) {
        this.overlapLabelTop = 0;
        return;
      }

      var summary = '<span class="title">Total</span>';

      if (this.showValues) {
        var attr = this.graph.valueAttr,
            selected = this.collection.getCurrentSelection(),
            value = '';

        if (selected.selectedModel) {
          value = this.collection.sum(attr, null, selected.selectedModelIndex);
        } else {
          value = this.collection.sum(attr);
        }

        if (this.showValuesPercentage && value) {
          summary += this.renderValuePercentage(value, 1);
        } else {
          summary += this.renderValuePercentage(value);
        }
      }

      if (this.showTimePeriod) {
        summary += '<span class="timeperiod">' + this.renderTimePeriod() + '</span>';
      }

      var summaryWrapper = this.figcaption.selectAll('div.summary').data(['one-wrapper']);
      summaryWrapper.enter().append('div').attr('class', 'summary');
      summaryWrapper.html(summary);

      var translateY = this.overlapLabelTop - this.margin.top + this.labelOffset;
      summaryWrapper.attr('style', 'margin-top: ' + translateY + 'px;');

      this.summaryHeight = $(summaryWrapper.node()).height() + this.summaryPadding;
    },

    renderLabels: function () {
      var that = this;

      var labelWrapper = this.figcaption.selectAll('ol').data(['one-wrapper']);
      labelWrapper.enter().append('ol').classed('squares', function () {
        return that.showSquare;
      }).classed('has-links', function () {
        return that.attachLinks;
      });

      var selection = labelWrapper.selectAll('li')
        .data(this.collection.models);
      var enterSelection = selection.enter().append('li');

      selection.attr('class', function (model, index) {
        var classes = ['label' + index];
        if (model.get('className')) {
          classes.push(model.get('className'));
        }
        if (model.get('timeshift')) {
          classes.push('timeshift');
        }
        return classes.join(' ');
      });

      if (this.attachLinks) {
        enterSelection.append('a');
        selection.selectAll('a').attr('href', function (group) {
          return group.get('href');
        });
        enterSelection.append('span');
        selection.selectAll('span').attr('class', 'meta');
      }

      selection.each(function (group, i) {
        that.setLabelContent.call(that, that.d3.select(this), group, i);
      });

      this.setLabelPositions(selection);
    },

    getYIdeal: function (groupIndex, index) {
      return this.graph.getYPos(groupIndex, index);
    },

    /**
     * Positions labels as close as possible to y position of last data point
     * @param {Selection} selection d3 selection to operate on
     */
    setLabelPositions: function (selection) {

      // labels are positioned in relation to last data point
      var maxModelIndex = this.collection.at(0).get('values').length - 1;

      // prepare 'positions' array
      var positions = [];
      var scale = this.scales.y;
      var that = this;
      selection.each(function (group, groupIndex) {
        var y;
        for (var index = maxModelIndex; index >= 0; index--) {
          y = that.getYIdeal.call(that, groupIndex, index);
          if (y !== null) {
            break;
          }
        }
        var size = $(this).height();

        positions.push({
          ideal: scale(y),
          size: size,
          id: group.get('id')
        });
      });

      // optimise positions
      positions = this.positions = this.calcPositions(positions, {
        min: this.overlapLabelTop + this.summaryHeight,
        max: this.graph.innerHeight + this.overlapLabelBottom
      });

      // apply optimised positions
      selection.attr('style', function (model, index) {
        return [
          'top:', that.margin.top + positions[index].min, 'px;',
          'left:', that.offset, 'px;'
        ].join('');
      });
    },

    setLabelContent: function (selection, group, groupIndex) {
      var labelTitle = '<span class="label-title">' + group.get('title') + '</span>',
          labelMeta = '';

      if (this.showValues) {
        var attr = this.graph.valueAttr,
            selected = this.collection.getCurrentSelection(),
            value = 0;

        if (this.showValuesPercentage && this.isLineGraph) {
          attr += '_original';
        }

        if (selected.selectedModel) {
          value = this.collection.at(groupIndex, selected.selectedModelIndex).get(attr);
        } else {
          if (this.isLineGraph) {
            value = this.collection.lastNonNullItem(attr, groupIndex, selected.selectedModelIndex).val;
          } else {
            value = this.collection.sum(attr, groupIndex);
          }
        }

        if (this.showValuesPercentage && value) {
          var fraction;
          fraction = this.collection.fraction(attr, groupIndex, selected.selectedModelIndex, this.isLineGraph);
          labelMeta += this.renderValuePercentage(value, fraction);
        } else {
          labelMeta += this.renderValuePercentage(value);
        }
      }

      if (group.get('timeshift')) {
        labelMeta += '<span class="percentage">(' + group.get('timeshift') + ' ' + this.collection.options.period + 's ago)</span>';
      }

      if (this.attachLinks) {
        selection.select('a').html(labelTitle);
        selection.select('.meta').html(labelMeta);
      } else {
        selection.html(labelTitle + labelMeta);
      }

    },

    /**
     * Draws line from y position of last item to label
     */
    renderLines: function () {
      var that = this;
      var selection = this.componentWrapper.selectAll('line')
        .data(this.positions);
      selection.enter().append('line');

      selection.each(function () {
        d3.select(this)
          .attr('x1', -that.offset + that.linePaddingInner)
          .attr('x2', -that.linePaddingOuter)
          .attr('y1', function (d) {
            return d.ideal;
          })
          .attr('y2', function (d) {
            return d.min;
          })
          .classed('crisp', function (d) {
            return d.ideal - d.min === 0;
          });
      });
    },

    renderTimePeriod: function () {
      var period = this.period || this.collection.query.get('period') || 'week',
          numPeriods = this.collection.at(0).get('values').length,
          selection = this.collection.getCurrentSelection();

      if (selection.selectedModel) {
        var model = selection.selectedModel;
        if (_.isArray(model) && model.length) {
          model = model[0];
        }
        return this.formatPeriod(model, period);
      } else {
        return [
          'last',
          numPeriods,
          this.format(numPeriods, { type: 'plural', singular: period })
        ].join(' ');
      }
    },

    onChangeSelected: function (groupSelected, groupIndexSelected) {
      this.render();
      var labels = this.figcaption.selectAll('li');
      var lines = this.componentWrapper.selectAll('line');
      labels.classed('selected', function (group, groupIndex) {
        return groupIndexSelected === groupIndex;
      });
      labels.classed('not-selected', function (group, groupIndex) {
        return groupIndexSelected !== null && groupIndexSelected !== groupIndex;
      });
      lines.classed('selected', function (group, groupIndex) {
        return groupIndexSelected === groupIndex;
      });
      lines.classed('not-selected', function (group, groupIndex) {
        return groupIndexSelected !== null && groupIndexSelected !== groupIndex;
      });
    },

    onHover: function (e) {
      var y = e.y;
      var bestIndex, bestDistance = Infinity;
      _.each(this.positions, function (elem, index) {
        var yLabel = Math.floor(elem.min) + 0.5;
        var distance = Math.abs(yLabel - y);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = index;
        }
      });
      if (e.toggle && bestIndex === this.collection.selectedIndex) {
        this.collection.selectItem(null);
      } else {
        this.collection.selectItem(bestIndex);
      }
    },

    /**
     * Optimises non-overlapping placement of items by trying to minimise the
     * sum of squared distances of each item to their "ideal" position.
     * Each item entry requires two properties:
     *  - ideal: the position the item is ideally placed at
     *  - size: the size of the item, e.g. width or height
     * @param {Array} items Items to be placed
     * @param {Object} [bounds=undefined] Defines bounds that the labels must stay within
     * @param {Number} [bounds.min=undefined] Lower boundary
     * @param {Number} [bounds.max=undefined] Upper boundary
     * @returns {Array} Item placement solution. Each entry contains a 'min' property defining the item's positions.
     */
    calcPositions: function (items, bounds) {
      var sumSize = _.reduce(items, function (memo, item) {
        return memo + item.size;
      }, 0);


      // check if everything fits
      if (bounds) {
        var availableSpace = bounds.max - bounds.min;
        if (sumSize > availableSpace) {
          // doesn't fit - overlap is necessary
          var overlapFactor = availableSpace / sumSize;
          _.each(items, function (item) {
            item.size *= overlapFactor;
          });
          sumSize = availableSpace;
        }
      }

      if (bounds) {
        // set boundaries for each item
        var sizeUsed = 0, sizeAvailable = bounds.max - bounds.min - sumSize;
        _.each(items, function (item) {
          item.absoluteLowestMin = bounds.min + sizeUsed;
          item.absoluteHighestMin = item.absoluteLowestMin + sizeAvailable;
          sizeUsed += item.size;
        });
      }

      // calculate initial solution
      var curMax = 0, sumSquareDist = 0;

      var bestSolution = _.map(items, function (item, index) {

        item = _.extend({}, item);
        item.index = index;
        item.min = Math.max(curMax, item.ideal);
        if (_.isNumber(item.absoluteLowestMin)) {
          item.min = Math.max(item.min, item.absoluteLowestMin);
        }
        if (_.isNumber(item.absoluteHighestMin)) {
          item.min = Math.min(item.min, item.absoluteHighestMin);
        }
        curMax = item.max = item.min + item.size;
        item.dist = item.min - item.ideal;
        item.squareDist = Math.pow(item.dist, 2);
        sumSquareDist += item.squareDist;

        return item;
      });
      bestSolution.sumSquareDist = sumSquareDist;

      var calcSolution = function (items, indexToOptimise) {

        var solution = [];

        // move anchor element a bit closer to ideal
        var anchor = _.extend({}, items[indexToOptimise]);
        var targetDist = anchor.dist * 0.9;

        anchor.min = anchor.ideal + targetDist;
        if (_.isNumber(anchor.absoluteLowestMin)) {
          anchor.min = Math.max(anchor.min, anchor.absoluteLowestMin);
        }
        if (_.isNumber(anchor.absoluteHighestMin)) {
          anchor.min = Math.min(anchor.min, anchor.absoluteHighestMin);
        }
        anchor.dist = anchor.min - anchor.ideal;
        var curMin = anchor.min;
        var curMax = anchor.max = anchor.min + anchor.size;

        anchor.squareDist = Math.pow(anchor.dist, 2);
        var sumSquareDist = anchor.squareDist;
        solution[anchor.index] = anchor;

        var item;

        // nudge previous elements upwards
        for (var i = indexToOptimise - 1; i >= 0; i--) {
          item = _.extend({}, items[i]);
          item.max = Math.min(item.max, curMin);
          curMin = item.min = item.max - item.size;
          item.dist = item.min - item.ideal;
          item.squareDist = Math.pow(item.dist, 2);
          sumSquareDist += item.squareDist;
          solution[i] = item;
        }

        // nudge following elements downwards
        for (i = indexToOptimise + 1; i < items.length; i++) {
          item = _.extend({}, items[i]);
          item.min = Math.max(item.min, curMax);
          curMax = item.max = item.min + item.size;
          item.dist = item.min - item.ideal;
          item.squareDist = Math.pow(item.dist, 2);
          sumSquareDist += item.squareDist;
          solution[i] = item;
        }

        solution.sumSquareDist = sumSquareDist;

        return solution;
      };

      var doIterate = true;
      var maxIterations = 100;
      var threshold = 1;

      var getItemsBySquareDist = function () {
        return _.sortBy(bestSolution, function (item) {
          return -item.squareDist;
        });
      };

      for (var iteration = 0; doIterate && iteration < maxIterations; iteration++) {
        doIterate = false;
        var itemsBySquareDist = getItemsBySquareDist();

        for (var i = 0, ni = itemsBySquareDist.length; i < ni && !doIterate; i++) {
          var item = itemsBySquareDist[i];
          var solution = calcSolution(bestSolution, item.index);
          var diff = bestSolution.sumSquareDist - solution.sumSquareDist;
          if (diff > threshold) {
            // new best solution found
            bestSolution = solution;
            // result has not converged yet, continue search
            doIterate = true;
          }
        }
      }

      return bestSolution;
    }
  });

  return LineLabel;
});
