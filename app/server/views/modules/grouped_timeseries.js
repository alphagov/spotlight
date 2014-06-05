var requirejs = require('requirejs');

var View = requirejs('extensions/views/view');
var template = requirejs('tpl!common/templates/visualisations/categories.html');


module.exports = View.extend({

  template: template,

});