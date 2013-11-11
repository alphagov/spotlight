define([
  'extensions/views/graph/callout'
],
function (Callout) {
  
  var ConversionCallout = Callout.extend({
  
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

      var allBarMargins = this.barMarginFraction * blockWidth;
      var allBlockMargins = this.blockMarginFraction * blockWidth;
      var barWidth = (blockWidth - allBlockMargins - allBarMargins) / numGroups;

      var x = blockMargin + blockWidth * index + barWidth * (groupIndex + 0.5);
      if (numBarSpaces > 0) {
        x += groupIndex * allBarMargins / numBarSpaces;
      }
      return x;
    },
    
    y: function (group, groupIndex, model, index) {
      return 0;
    },
    
    getPivotingElement: function () {
      return this.calloutEl.find('.arrow');
    },

    renderContent: function (el, group, groupIndex, model, index) {

      var arrow = $('<div>').addClass('arrow').html('<span class="outer-arrow">&#x25B2;</span><span class="inner-arrow">&#x25B2;</span>');

      var query = model.collection.query;
      var start = query.get('start_at');
      var end = moment(query.get('end_at')).subtract(1, 'days');

      var header = $('<h3>').html([
        '<span class="date stack' + groupIndex + '">',
        start.format(start.month() === end.month() ? 'D' : 'D MMM'),
        ' to ',
        end.format('D MMM YYYY'),
        '</span> ',
        'Stage: ',
        model.get('title')
      ].join(''));

      var body = $('<dl>').html([
        '<dt>Unique visitors to stage:</dt>',
        '<dd>',
        this.formatNumericLabel(model.get('uniqueEvents')),
        '</dd>',
        '<dt>Percentage relative to start:</dt>',
        '<dd>',
          this.formatPercentage(model.get('uniqueEventsNormalised')),
        '</dd>'
      ].join(''));
      
      el.empty().append(arrow, header, body);
    }
    

  });
  
  return ConversionCallout;
});
