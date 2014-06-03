var requirejs = require('requirejs');

var template = requirejs('stache!common/templates/visualisations/completion_rate');
var View = requirejs('extensions/views/view');

module.exports = View.extend({

  template: template

});