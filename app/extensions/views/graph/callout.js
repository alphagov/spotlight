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

    render: function () {
      if (!this.calloutEl) {
        this.calloutEl = $('<div></div>').addClass(this.classed + ' performance-hidden').appendTo(this.$el);
      }
    },

    getPivotingElement: function () {
      return this.calloutEl;
    },

    onChangeSelected: function (group, groupIndex, model, index) {
      var el = this.calloutEl;
      if (!group || !model) {
        el.addClass('performance-hidden');
        return;
      }
      this.renderContent(el, group, groupIndex, model, index);
      el.removeClass('performance-hidden');
      
      var scaleFactor = this.graph.scaleFactor();
      
      var basePos = {
        x: this.x(group, groupIndex, model, index) * scaleFactor,
        y: this.y(group, groupIndex, model, index) * scaleFactor
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
    
    x: function (group, groupIndex, model, index) {
      return this.scales.x(this.graph.getXPos(groupIndex, index));
    },
    
    y: function (group, groupIndex, model, index) {
      return this.scales.y(this.graph.getYPos(groupIndex, index));
    },
    
    onMouseMove: function (e) {
      return false;
    },

    configs: {
      week: {
        getHeader: function (el, group, groupIndex, model, index) {
          return this.formatPeriod(model, 'week');
        }
      },
      month: {
        getHeader: function (el, group, groupIndex, model, index) {
          return this.formatPeriod(model, 'month');
        }
      }
    },

    renderContent: function (el, group, groupIndex, model, index) {
      
      var header = $('<h3>').html(this.getHeader.apply(this, arguments));

      var value = this.formatNumericLabel(
        Math.floor(model.get(this.graph.valueAttr))
      );
      if (this.showPercentage) {
        value += ' (' + this.formatPercentage(model.get('fraction')) + ')';
      }

      var detail = $('<dl>').html([
        '<dt>',
        group.get('title'),
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
