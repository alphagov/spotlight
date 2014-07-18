define([
  'extensions/views/graph/component'
],
function (Component) {

  return Component.extend({

    offset: 20,
    linePaddingInner: 4,
    linePaddingOuter: 4,
    overlapLabelTop: 40,
    overlapLabelBottom: 20,
    labelOffset: 6,

    showSquare: true,
    summaryPadding: -36,
    summaryHeight: 0,

    classed: 'labels',

    interactive: true,

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

    onHover: function (e) {
      if (e.slice % 3 !== 2) {
        return;
      }
      var closest;
      var diff = Infinity;
      _.each(this.positions, function (pos) {
        var y = pos.min - this.margin.top + this.labelOffset + (pos.size / 2);
        var d = Math.abs(y - e.y);
        if (d < diff) {
          diff = d;
          closest = pos;
        }
      }, this);
      this.selectLine(closest.key);
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
        this.selectLine(this.positions[index].key);
        e.stopPropagation();
      };

      return events;
    },

    selectLine: function (key) {
      var index, options;
      if (key) {
        this.collection.each(function (model, i) {
          if (model.get(key) !== null) {
            index = i;
          }
        });
        options = { valueAttr: key, force: true };
      }
      this.collection.selectItem(index, options);
    },

    renderValuePercentage: function (value, percentage) {
      var data = [],
          summary = '',
          format = this.graph.currency ? 'currency' : 'number';

      if (value === null && !percentage) {
        return '<span class="no-data">(no data)</span>';
      }

      if (value !== null) {
        data.push(this.format(value, { type: format, magnitude: true, pad: true }));
      }
      if (percentage) {
        if (this.graph.isOneHundredPercent()) {
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

      var selected = this.collection.getCurrentSelection();
      var model;

      if (selected.selectedModel) {
        model = selected.selectedModel;
      } else {
        var lines = this.graph.getLines();
        model = this.collection.lastDefined(_.pluck(lines, 'key'));
      }
      var output = this.formatPeriod(model, this.graph.getPeriod());

      var summary = '<span class="timeperiod">' + output + '</span>';

      var summaryWrapper = this.figcaption.selectAll('div.summary').data(['one-wrapper']);
      summaryWrapper.enter().append('div').attr('class', 'summary');
      summaryWrapper.html(summary);

      var translateY = this.overlapLabelTop - this.margin.top + this.labelOffset;
      summaryWrapper.attr('style', 'margin-top: ' + translateY + 'px;');

      this.summaryHeight = $(summaryWrapper.node()).height() + this.summaryPadding;
    },

    renderLabels: function () {
      var that = this;
      var lines = this.graph.getLines();

      var labelWrapper = this.figcaption.selectAll('ol').data(['one-wrapper']);
      labelWrapper.enter().append('ol').classed('squares', function () {
        return that.showSquare;
      }).classed('has-links', function () {
        return _.any(lines, function (line) { return line.href; });
      });

      var selection = labelWrapper.selectAll('li')
        .data(lines);
      selection.enter().append('li');

      selection.attr('class', function (line, index) {
        var classes = ['label' + index];
        if (line.className) {
          classes.push(line.className);
        }
        if (line.timeshift) {
          classes.push('timeshift');
        }
        return classes.join(' ');
      });

      selection.each(function (line, i) {
        that.setLabelContent.call(that, that.d3.select(this), line, i);
      });

      this.setLabelPositions(selection);
    },

    getYIdeal: function (attr) {
      var index = this.collection.length;
      var val = null;
      while (val === null && index > 0) {
        index--;
        val = this.graph.getYPos(index, attr);
      }
      return val;
    },

    /**
     * Positions labels as close as possible to y position of last data point
     * @param {Selection} selection d3 selection to operate on
     */
    setLabelPositions: function (selection) {

      // prepare 'positions' array
      var positions = [];
      var scale = this.scales.y;
      var that = this;
      selection.each(function (line) {
        var y = that.getYIdeal(line.key);

        var size = $(this).height();

        positions.push({
          ideal: scale(y),
          size: size,
          key: line.key
        });
      });

      positions = positions.sort(function (a, b) {
        return a.ideal - b.ideal;
      });

      // optimise positions
      positions = this.positions = this.calcPositions(positions, {
        min: this.overlapLabelTop + this.summaryHeight,
        max: this.graph.innerHeight + this.overlapLabelBottom
      });

      // apply optimised positions
      selection.attr('style', function (line) {
        var id = line.key;
        var position = _.find(positions, function (pos) {
          return pos.key === id;
        });
        return position ? [
          'top:', that.margin.top + position.min, 'px;',
          'left:', that.offset, 'px;'
        ].join('') : '';
      });
    },

    setLabelContent: function (selection, line) {
      var labelTitle = '<span class="label-title">' + line.label + '</span>',
          labelMeta = '';

      selection.select('a').remove();
      selection.select('span.meta').remove();

      var selected = this.collection.getCurrentSelection(),
          value = 0,
          percentage,
          model,
          attr = line.key;

      if (selected.selectedModel) {
        model = selected.selectedModel;
      } else {
        model = this.collection.lastDefined(_.pluck(this.graph.getLines(), 'key'));
      }

      if (this.graph.isOneHundredPercent()) {
        value = model.get(attr.replace(':percent', ''));
        if (value !== null) {
          percentage = model.get(attr);
        }
      } else {
        value = model.get(attr);
        if (this.showPercentages()) {
          if (value !== null) {
            percentage = model.get(attr + ':percent');
          }
        }
      }

      labelMeta += this.renderValuePercentage(value, percentage);

      if (line.timeshift) {
        labelMeta = '<span class="label-title label-timeshift">(' + line.timeshift + ' ' + this.collection.getPeriod() + 's ago)</span>' + labelMeta;
      }

      if (line.href) {
        selection.append('a').attr('href', line.href).html(labelTitle);
        selection.append('span').attr('class', 'meta').html(labelMeta);
      } else {
        selection.html(labelTitle + labelMeta);
      }

    },

    showPercentages: function () {
      return _.any(this.graph.getLines(), function (line) {
        return line.key.match(/^total:/);
      });
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

    onChangeSelected: function (model, index, options) {
      options = options || {};
      this.render();
      var labels = this.figcaption.selectAll('li');
      var lines = this.componentWrapper.selectAll('line');
      var selected = function (line) {
        return model && options.valueAttr === line.key;
      };
      var unselected = function (line) {
        return model && options.valueAttr && options.valueAttr !== line.key;
      };
      labels.classed('selected', selected);
      labels.classed('not-selected', unselected);
      lines.classed('selected', selected);
      lines.classed('not-selected', unselected);
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

});
