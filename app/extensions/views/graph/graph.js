define([
  'extensions/views/view',
  'd3loader!',
  './xaxis',
  './yaxis',
  './yaxisRight',
  './line',
  './stack',
  './linelabel',
  './hover',
  './callout',
  './tooltip',
  './missing-data',
  'extensions/views/graph/table'
],
function (View, d3, XAxis, YAxis, YAxisRight, Line, Stack, LineLabel, Hover, Callout, Tooltip, MissingData, GraphTable) {

  var Graph = View.extend({

    d3: d3,

    valueAttr: '_count',

    minYDomainExtent: 6,
    numYTicks: 7,

    sharedComponents: {
      xaxis: XAxis,
      yaxis: YAxis,
      yaxisRight: YAxisRight,
      line: Line,
      stack: Stack,
      linelabel: LineLabel,
      callout: Callout,
      hover: Hover,
      tooltip: Tooltip
    },

    initialize: function (options) {
      View.prototype.initialize.apply(this, arguments);

      var collection = this.collection = options.collection;
      this.listenTo(collection, 'reset add remove sync', this.render);

      this.prepareGraphArea();

      this.scales = {};
      this.margin = {};

      if (this.collection.options.axes) {
        this.table = new GraphTable(_.extend(options, {$el: this.figure, valueAttr: this.valueAttr}));
      }

      // initialize graph components
      this.componentInstances = [];
      var defaultComponentOptions = this.getDefaultComponentOptions();
      _.each(this.prop('components'), function (definition) {
        var options = _.extend({}, defaultComponentOptions, definition.options);
        this.componentInstances.push(new definition.view(options));
      }, this);

      if (isClient) {
        $(window).on('resize.' + this.cid, _.bind(this.render, this));
      }

      // Check for hash date parameters.
      this.queryStart = this.collection.query.get('start_at');
      this.queryEnd = this.collection.query.get('end_at');
      var hashParams = this.getHashParams();
      var hashStart = hashParams.start;
      var hashEnd = hashParams.end;
      if (hashStart && (hashStart !== this.queryStart.format('YYYY-MM-DD'))) {
        this.queryStart = this.collection.getMoment(hashStart + 'T00:00:00+00:00');
        this.collection.query.set('start_at', this.queryStart);
      }
      if (hashEnd && (hashEnd !== this.queryEnd.format('YYYY-MM-DD'))) {
        this.queryEnd = this.collection.getMoment(hashEnd + 'T00:00:00+00:00');
        this.collection.query.set('end_at', this.queryEnd);
      }

      // Load date pickers for modules where it makes sense to use them.
      if (this.model && this.model.get('slug') &&
          (this.model.get('page-type') === 'module') &&
          (this.model.get('module-type') !== 'realtime') &&
          (this.model.get('module-type') !== 'journey') &&
          (this.model.get('module-type') !== 'bar_chart_with_number')) {
        this.setDatePickers();
      }

    },

    /**
     * Defines default options that get passed to all graph components.
     * This object will be extended with component-specific options.
     * @returns {Object} Default options that get passed to components
     */
    getDefaultComponentOptions: function () {
      return {
        graph: this,
        collection: this.collection,
        el: this.figure,
        svg: this.svg,
        wrapper: this.wrapper,
        margin: this.margin,
        scales: this.scales
      };
    },

    showLineLabels: function () {
      return this.model && this.model.get('show-line-labels');
    },

    isOneHundredPercent: function () {
      return this.model && this.model.get('one-hundred-percent');
    },

    prepareGraphArea: function () {
      var figure = this.figure = $('<figure/>').addClass('graph');
      if (this.showLineLabels()) {
        figure.addClass('graph-with-labels');
      }
      figure.appendTo(this.$el);

      var graphWrapper = this.graphWrapper = $('<div class="graph-wrapper"></div>');
      graphWrapper.appendTo(figure);

      this.innerEl = $('<div class="inner"></div>');
      this.innerEl.appendTo(graphWrapper);

      var svg = this.svg = this.d3.select(graphWrapper[0]).append('svg');

      // Apply attributes to SVGs so that they're ignored by screenreaders.
      // The WAI-ARIA 1.0 spec says that authors MAY use aria-hidden only
      // if they're hiding content to improve the experience for users
      // of assistive technologies.
      svg.attr('role', 'presentation');
      svg.attr('aria-hidden', 'true');

      this.wrapper = svg.append('g')
        .classed('wrapper', true);

    },

    setDatePickers: function () {

      this.dateFormat = 'YYYY-MM-01';

      // TODOs:
      // Make the date pickers into a component!
      // Use a template!
      // Add error handling!

      // Add HTML to the page.
      var datePickerHtml = '<div id="datePicker" style="margin: 5px 0; width: 100%; ';
      datePickerHtml += ' border-bottom: 1px dotted #ccc; padding: 5px 0">Show data for: ';
      datePickerHtml += '<select id="dateFrom"></select> to ';
      datePickerHtml += '<select id="dateTo"></select> ';
      datePickerHtml += '<span class="warning" style="color: red"></span>';
      datePickerHtml += '</div>';
      this.datePickerEl = $(datePickerHtml);
      var slug = this.model.get('slug');
      var header = $('section#' + slug + ' h1');
      header.after(datePickerHtml);

      // Set up up the date options lists.
      var optionsStart = this.collection.getMoment('2012-04-01');
      var optionsEnd = this.collection.getMoment();
      var dateOptions = '';
      var loopStart = this.collection.getMoment(optionsEnd);
      for (var i = loopStart; !this.collection.getMoment(i).isBefore(optionsStart); i.subtract('months', 1)) {
        dateOptions += '<option value="' + i.format(this.dateFormat) + '">';
        dateOptions += i.format('MMM YYYY');
        dateOptions += '</option>';
      }
      $('#dateFrom, #dateTo').html(dateOptions);

      this.queryStart = this.queryStart || optionsStart;
      this.queryEnd = this.queryEnd || optionsEnd;

      // Preset the dropdowns to the dates shown on the graph.
      $('#dateFrom').val(this.queryStart.format(this.dateFormat));
      $('#dateTo').val(this.queryEnd.format(this.dateFormat));

      // Set the axis period as appropriate.
      this.resetAxisPeriod();

      // Add event listeners.
      var that = this;
      // window.onpopstate = function() {
      //     that.updateGraphDates();
      // };
      $('#dateFrom, #dateTo').on('change', function () {
          that.updateGraphDates();
      });

    },

    updateGraphDates: function() {
      $('#datePicker .warning').text('');

      this.queryStart = this.collection.getMoment($('#dateFrom').val() + 'T00:00:00+00:00');
      this.queryEnd = this.collection.getMoment($('#dateTo').val() + 'T00:00:00+00:00');
      if (this.queryStart >= this.queryEnd) {
        $('#datePicker .warning').text('Start date must be earlier than end date');
        return false;
      }
      this.resetAxisPeriod();
      this.collection.query.set('start_at', this.queryStart);
      this.collection.query.set('end_at', this.queryEnd);
      this.render();

      this.setHashParams();
    },

    getHashParams: function () {
      var hash = window.location.hash.replace('#', '');
      var params = {};
      if (hash) {
        var hashParams = hash.split('&');
        _.each(hashParams, function(p) {
          if (p.substring(0, 5) === 'from=') {
            params.start = p.replace('from=', '');
          }
          if (p.substring(0, 3) === 'to=') {
            params.end = p.replace('to=', '');
          }
        });
      }
      return params;
    },

    setHashParams: function() {
      var hashStr = '#from=' + this.queryStart.format(this.dateFormat);
      hashStr += '&to=' + this.queryEnd.format(this.dateFormat);
      window.location.hash = hashStr;
    },

    resetAxisPeriod: function () {
      var daysDiff = this.queryEnd.diff(this.queryStart, 'days');
      if (daysDiff > 90) {
        this.collection.options.axisPeriod = 'month';
      } else {
        this.collection.options.axisPeriod = 'week';
      }
    },

    /**
     * Calculates current factor between size in displayed pixels and logical
     * size.
     */
    scaleFactor: function () {
      return $(this.svg.node()).width() / this.width;
    },

    getModel: function (groupIndex, modelIndex) {
      if (!this.collection.at(groupIndex) && this.encompassStack) {
        return this.collection.at(groupIndex - 1, modelIndex);
      } else {
        return this.collection.at(groupIndex, modelIndex);
      }
    },

    modelToDate: function (model) {
      var prop = this.getPeriod() === 'hour' ? '_timestamp' : '_start_at';
      return this.getMoment(model.get(prop));
    },

    getXPos: function (groupIndex, modelIndex) {
      groupIndex = groupIndex || 0;
      var model = this.getModel(groupIndex, modelIndex);
      return this.modelToDate(model);
    },

    getYPos: function (groupIndex, modelIndex) {
      var group = this.collection.at(groupIndex);
      var model = group.get('values').at(modelIndex);
      return model.get(this.valueAttr);
    },

    calcXScale: function () {
      var total = this.collection.first().get('values'),
          start = this.modelToDate(total.first()).toDate(),
          end = this.modelToDate(total.last()).toDate();

      return this.d3.time.scale()
              .domain([start, end])
              .range([0, this.innerWidth]);
    },

    calcYScale: function () {
      var max = this.maxValue();

      var yScale = this.d3.scale.linear();
      if (max) {
        var tickValues = this.calculateLinearTicks([this.minValue(), Math.max(this.maxValue(), this.minYDomainExtent)], this.numYTicks);
        yScale.domain(tickValues.extent);
        yScale.tickValueList = tickValues.values;
      }
      yScale.rangeRound([this.innerHeight, 0]);
      return yScale;
    },

    maxValue: function () {
      var d3 = this.d3;
      var valueAttr = this.valueAttr;
      return d3.max(this.collection.toJSON(), function (group) {
        return d3.max(group.values.toJSON(), function (value) {
          return value[valueAttr];
        });
      });
    },

    minValue: function () {
      return 0;
    },

    hasData: function () {
      return this.maxValue() !== undefined;
    },

    getPeriod: function () {
      var period = 'week';
      if (this.collection && this.collection.options.axisPeriod) {
        period = this.collection.options.axisPeriod;
      } else if (this.collection && this.collection.query.get('period')) {
        period = this.collection.query.get('period');
      } else if (this.model && this.model.get('period')) {
        period = this.model.get('period');
      }
      return period;
    },

    /**
     * Returns an object describing evenly spaced, nice tick values given an extent and a minimum tick count.
     * The returned object will include the values, extent and step of the ticks.
     * The extent may be extended to include the next nice tick value.
     *
     * @param extent
     * @param minimumTickCount
     * @return {Object}
     */
    calculateLinearTicks: function (extent, minimumTickCount) {

      if (extent[0] >= extent[1]) {
        throw new Error('Upper bound must be larger than lower.');
      }
      var targetTickCount = (minimumTickCount === 1) ? minimumTickCount : minimumTickCount - 1,
          span = extent[1] - extent[0],
          step = Math.pow(10, Math.floor(Math.log(span / targetTickCount) / Math.LN10)),
          err = targetTickCount / span * step;

      // Filter ticks to get closer to the desired count.
      if (err <= 0.15) step *= 10;
      else if (err <= 0.35) step *= 5;
      else if (err <= 0.75) step *= 2;

      // Round start and stop values to step interval.
      var first = Math.floor(extent[0] / step) * step,
          last = Math.ceil(extent[1] / step) * step,
          lastInclusive = last + step / 2;

      return {
        values: _.range(first, lastInclusive, step),
        extent: [first, last],
        step: step
      };
    },

    pxToValue: function (cssVal) {
      if (!_.isString(cssVal)) {
        return null;
      }
      var matches = cssVal.match(/([0-9\.]+)px/);
      return matches ? parseFloat(matches[1]) : null;
    },

    resize: function () {
      var $svg = $(this.svg.node());
      $svg.attr('style', '');
      var width = this.width = $svg.parent().width(),
          height;

      // when both max-width and max-height are defined, scale graph according
      // to this aspect ratio
      var maxWidth = this.pxToValue($svg.css('max-width'));
      var maxHeight = this.pxToValue($svg.css('max-height'));
      var minHeight = this.pxToValue($svg.css('min-height'));

      if (_.isNumber(maxWidth) && _.isNumber(maxHeight)) {
        var aspectRatio = maxWidth / maxHeight;
        height = width / aspectRatio;
        if (_.isNumber(minHeight)) {
          height = Math.max(height, minHeight);
        }
      } else {
        height = $svg.height();
      }
      this.height = height;

      // configure SVG for automatic resize
      this.svg.attr({
        width: '100%',
        height: '100%',
        viewBox: '0 0 ' + width + ' ' + height,
        style: 'max-width:' + width + 'px; max-height:' + height + 'px; display:block;'
      });
      $svg.height(height);

      var innerEl = this.innerEl;
      this.margin.top = innerEl.position().top;
      this.margin.left = innerEl.position().left;

      this.innerWidth = innerEl.outerWidth();
      this.innerHeight = innerEl.outerHeight();

      this.margin.bottom = height - this.margin.top - this.innerHeight;
      this.margin.right = width - this.margin.left - this.innerWidth;

      this.wrapper.attr('transform', [
        'translate(',
        this.margin.left,
        ', ',
        this.margin.top,
        ')'
      ].join(''));
    },

    /**
     * The linelabel figcaption is positioned on top of the graph
     * at small screen sizes using position static.
     */
    lineLabelOnTop: function () {
      return this.$el.find('figcaption').css('position') === 'static';
    },

    /**
     * Hide callout during resize if present. Works around bug in iOS Webkit
     * that incorrectly calculates height of inner element.
     */
    resizeWithCalloutHidden: function () {
      var callout = this.$el.find('.callout');
      var calloutHidden = callout.hasClass('performance-hidden');
      callout.addClass('performance-hidden');

      this.resize();

      if (!calloutHidden) {
        callout.removeClass('performance-hidden');
      }
    },

    /**
     * Applies current configuration, then renders components in defined order
     */
    render: function () {
      if (isServer || !this.isVisible()) {
        return;
      }
      if (this.collection.isEmpty()) {
        this.missingData = new MissingData({
          el: this.figure
        });
        this.missingData.render();
        return;
      }

      View.prototype.render.apply(this, arguments);

      if (this.collection.options) {
        this.currency = this.collection.options.currency;
      }

      this.resizeWithCalloutHidden();

      this.scales.x = this.calcXScale();
      this.scales.y = this.calcYScale();

      _.each(this.componentInstances, function (component) {
        component.render();
      }, this);
      if (this.table) {
        this.table.render();
      }
    },

    remove: function () {
      if (this.table) {
        this.table.remove();
      }
      _.invoke(this.componentInstances, 'remove');
      this.componentInstances = [];
      if (isClient) {
        $(window).off('resize.' + this.cid);
      }
      return View.prototype.remove.apply(this, arguments);
    },

    // allow stubbing of visiblity for testing
    isVisible: function () {
      return this.$el.is(':visible');
    }
  });

  return Graph;
});
