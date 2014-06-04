var requirejs = require('requirejs');

var View = requirejs('common/views/visualisations/bar_chart_with_number');
var template = requirejs('stache!common/templates/visualisations/bar_chart_with_number');

module.exports = View.extend({

  template: template,

  views: function () {
    var views = View.prototype.views.apply(this, arguments);
    delete views['.bar'];
    return views;
  }

});
