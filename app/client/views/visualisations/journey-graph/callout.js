define([
  'client/views/graph/component',
  'extensions/mixins/pivot'
],
function (Component, Pivot) {

  var JourneyCallout = Component.extend({

    events: {
      'mousemove': 'onMouseMove'
    },

    horizontal: 'centre',
    vertical: 'bottom',
    xOffset: 0,
    yOffset: 0,
    constrainToBounds: false,
    classed: 'callout',

    blockMarginFraction: 0.2,
    barMarginFraction: 0.05,

    initialize: function (options) {
      Component.prototype.initialize.apply(this, arguments);
      options = options || {};
      this.showPercentage = options.showPercentage;
    },

    render: function () {
      if (!this.calloutEl) {
        this.calloutEl = $('<div></div>').addClass(this.classed + ' performance-hidden').appendTo(this.$el);
      }
    },

    onChangeSelected: function (model, index, options) {
      var el = this.calloutEl;
      if (!model) {
        el.addClass('performance-hidden');
        return;
      }
      options = options || {};
      this.renderContent(el, model, options.valueAttr);
      el.removeClass('performance-hidden');

      var scaleFactor = this.graph.scaleFactor();

      var basePos = {
        x: this.x(index) * scaleFactor,
        y: this.y(index, options.valueAttr) * scaleFactor
      };

      var pivotingEl = this.getPivotingElement();

      var pos = this.applyPivot(basePos, {
        horizontal: this.horizontal,
        vertical: this.vertical,
        xOffset: this.xOffset,
        yOffset: this.yOffset,
        constrainToBounds: this.constrainToBounds,
        width: pivotingEl.width(),
        height: pivotingEl.height()
      }, {
        width: this.graph.innerWidth * scaleFactor,
        height: this.graph.innerHeight * scaleFactor
      });

      pivotingEl.css({
        left: pos.x + this.margin.left * scaleFactor,
        top: pos.y + this.margin.top * scaleFactor
      });
    },

    x: function (index) {
      var blockWidth = this.scales.x(1) - this.scales.x(0);
      var blockMargin = this.blockMarginFraction * blockWidth / 2;

      var numBarSpaces = this.collection.length - 1;

      var allBarMargins = numBarSpaces > 0 ? this.barMarginFraction * blockWidth : 0;
      var allBlockMargins = this.blockMarginFraction * blockWidth;
      var barWidth = (blockWidth - allBlockMargins - allBarMargins);

      var x = blockMargin + blockWidth * index + barWidth / 2;
      return x;
    },

    y: function () {
      return 0;
    },

    onMouseMove: function () {
      return false;
    },

    getHeader: function (el, model) {
      var period = this.graph.collection.query.get('period') || 'week';
      return this.formatPeriod(model, period);
    },

    getPivotingElement: function () {
      return this.calloutEl.find('.arrow');
    },

    renderContent: function (el, model) {
      var attr = this.graph.valueAttr;

      var arrow = $('<div>').addClass('arrow').html('<span class="outer-arrow">&#x25B2;</span><span class="inner-arrow">&#x25B2;</span>');

      var dateRange = model.collection.dataSource.get('query-params');
      var start = this.getMoment(dateRange['start_at']);
      var end = this.getMoment(dateRange['end_at']).subtract(1, 'days');
      var val = model.get(attr) || 0;
      var max = this.collection.at(0).get(attr) || 1;

      var header = $('<h3>').html([
        '<span class="date stack">',
        start.format(start.month() === end.month() ? 'D' : 'D MMM'),
        ' to ',
        end.format('D MMM YYYY'),
        '</span> ',
        'Stage: ',
        model.get('title')
      ].join(''));

      var body = $('<dl>').html([
        '<dt>Number of users:</dt>',
        '<dd>',
        this.format(val, { type: 'number', magnitude: true, pad: true }),
        '</dd>',
        '<dt>Percentage relative to start:</dt>',
        '<dd>',
        this.format(val / max, 'percent'),
        '</dd>'
      ].join(''));

      el.empty().append(arrow, header, body);
    }


  });

  _.extend(JourneyCallout.prototype, Pivot);

  return JourneyCallout;
});
