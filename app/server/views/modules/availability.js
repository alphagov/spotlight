var requirejs = require('requirejs');

var View = requirejs('common/views/visualisations/availability');
var template = requirejs('stache!common/templates/visualisations/availability');

module.exports = View.extend({

  template: template,

  views: function () {
    var views = View.prototype.views.apply(this, arguments);
    delete views['.uptime-graph'];
    delete views['.response-time-graph'];
    return views;
  }

});
