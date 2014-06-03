var requirejs = require('requirejs');

var View = requirejs('extensions/views/view');

var template = requirejs('stache!common/templates/visualisations/tab');

module.exports = View.extend({

  template: template

});