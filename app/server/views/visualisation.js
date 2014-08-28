var requirejs = require('requirejs');
var path = require('path');

var View = requirejs('extensions/views/view');

var templater = require('../mixins/templater');
var templatePath = path.resolve(__dirname, '../templates/visualisation.html');

module.exports = View.extend(templater).extend({

  templatePath: templatePath,

  templateType: 'mustache'

});