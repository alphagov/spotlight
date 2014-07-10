define([
  'extensions/views/graph/component',
  'extensions/mixins/pivot'
],
function (Component, Pivot) {
  var Callout = Component.extend({

    events: {
      'mousemove': 'onMouseMove'
    },

    horizontal: 'right',
    vertical: 'bottom',
    xOffset: -7,
    yOffset: -7,
    constrainToBounds: true,
    classed: 'callout',

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

    getPivotingElement: function () {
      return this.calloutEl;
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
      return this.scales.x(this.graph.getXPos(index));
    },

    y: function (index, valueAttr) {
      return this.scales.y(this.graph.getYPos(index, valueAttr));
    },

    onMouseMove: function () {
      return false;
    },

    getHeader: function (el, model) {
      var period = this.graph.collection.query.get('period') || 'week';
      return this.formatPeriod(model, period);
    },

    renderContent: function (el, model, valueAttr) {

      var header = $('<h3>').html(this.getHeader.apply(this, arguments));
      var format = this.graph.currency ? 'currency' : 'integer';
      valueAttr = valueAttr || this.graph.valueAttr;

      var value;
      if (this.showPercentage) {
        value = this.format(model.get(valueAttr), 'percent');
        value += ' (' + this.format(model.get(valueAttr + '_original'), { type: format, magnitude: true, pad: true }) + ')';
      } else {
        value = this.format(model.get(valueAttr), { type: format, magnitude: true, pad: true });
      }

      var detail = $('<dl>').html([
        '<dt>',
        model.get('title'),
        '</dt>',
        '<dd>',
        value,
        '</dd>'
      ].join(''));

      el.empty().append(header, detail);
    }
  });

  _.extend(Callout.prototype, Pivot);

  return Callout;
});
