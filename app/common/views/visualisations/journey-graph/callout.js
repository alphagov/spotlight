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

    x: function (group, groupIndex, model, index) {
      // TODO: This calculation is repeated from InterleavedBar component
      // What is the cleanest way to share this calculation?
      var blockWidth = this.scales.x(1) - this.scales.x(0);
      var blockMargin = this.blockMarginFraction * blockWidth / 2;

      var numGroups = this.collection.length;
      var numBarSpaces = numGroups - 1;

      var allBarMargins = numBarSpaces > 0 ? this.barMarginFraction * blockWidth : 0;
      var allBlockMargins = this.blockMarginFraction * blockWidth;
      var barWidth = (blockWidth - allBlockMargins - allBarMargins) / numGroups;

      var x = blockMargin + blockWidth * index + barWidth * (groupIndex + 0.5);
      if (numBarSpaces > 0) {
        x += groupIndex * allBarMargins / numBarSpaces;
      }
      return x;
    },

    y: function () {
      return 0;
    },

    getPivotingElement: function () {
      return this.calloutEl.find('.arrow');
    },

    renderContent: function (el, group, groupIndex, model) {

      var attr = this.graph.valueAttr;

      var arrow = $('<div>').addClass('arrow').html('<span class="outer-arrow">&#x25B2;</span><span class="inner-arrow">&#x25B2;</span>');

      var query = model.collection.query;
      var start = query.get('start_at');
      var end = this.getMoment(query.get('end_at')).subtract(1, 'days');
      var val = model.get(attr) || 0;
      var max = model.collection.max(function (m) { return m.get(attr) || 0; }).get(attr) || 1;

      var isOptional = model.get('isOptional') ? ' (optional)' : '';
      var header = $('<h3>').html([
        '<span class="date stack' + groupIndex + (isOptional ? ' optional' : '') + '">',
        start.format(start.month() === end.month() ? 'D' : 'D MMM'),
        ' to ',
        end.format('D MMM YYYY'),
        '</span> ',
        'Stage: ',
        model.get('title'),
        isOptional
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
