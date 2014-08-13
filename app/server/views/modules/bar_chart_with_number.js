var requirejs = require('requirejs');

var View = requirejs('common/views/visualisations/bar_chart_with_number');
var template = requirejs('stache!common/templates/visualisations/bar_chart_with_number');

module.exports = View.extend({

  template: template,

});
