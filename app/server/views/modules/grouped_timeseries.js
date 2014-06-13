var requirejs = require('requirejs');

var View = requirejs('extensions/views/view');
var template = requirejs('stache!common/templates/visualisations/categories');


module.exports = View.extend({

  template: template,

});