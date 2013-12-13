define([
  'extensions/views/view',
  'common/views/visualisations/multi_stat_item',
  'stache!common/templates/visualisations/multi_stats',
  'Mustache'
],
function (View, MultiStatItem, template, Mustache) {
  var MultiStatsView = View.extend({

    template: template,

    sparkline: true,
    
    render: function() { 
        View.prototype.render.apply(this, arguments);
        
        var ul = this.$el.find('ul');
        _.each(this.getStats(), function(d) {
          var el = $('<li>').appendTo(ul);
          view = new MultiStatItem({
            collection: this.collection,
            stat: d,
            el: el,
            sparkline: this.sparkline
          });
          view.render();
        }, this);
    }, 

    getStats: function() { 

      var stats = [];
      if (this.collection.length) {
        stats = this.model.get('stats');
      }
      return stats;
      
    }

  });
  return MultiStatsView;
});