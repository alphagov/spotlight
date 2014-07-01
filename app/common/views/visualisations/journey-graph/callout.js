define([
  'extensions/views/graph/callout'
],
function (Callout) {

  var JourneyCallout = Callout.extend({

    horizontal: 'centre',
    vertical: 'bottom',
    xOffset: 0,
    yOffset: 0,
    constrainToBounds: false,

    blockMarginFraction: 0.2,
    barMarginFraction: 0.05,

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

    getPivotingElement: function () {
      return this.calloutEl.find('.arrow');
    },

    renderContent: function (el, model) {
      var attr = this.graph.valueAttr;

      var arrow = $('<div>').addClass('arrow').html('<span class="outer-arrow">&#x25B2;</span><span class="inner-arrow">&#x25B2;</span>');

      var start = this.collection.query.get('start_at');
      var end = this.collection.query.get('end_at').clone().subtract(1, 'days');
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

  return JourneyCallout;
});
