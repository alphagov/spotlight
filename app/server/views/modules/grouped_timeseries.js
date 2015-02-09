var requirejs = require('requirejs');
var path = require('path');

var View = requirejs('extensions/views/view');
var templatePath = path.resolve(__dirname, '../../templates/modules/categories.html');
var templater = require('../../mixins/templater');

module.exports = View.extend(templater).extend({

  templatePath: templatePath,

  templateType: 'mustache'

});